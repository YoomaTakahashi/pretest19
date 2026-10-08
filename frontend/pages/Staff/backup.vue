<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="12">
                <v-card>
                    <v-card-title>
                        <h1 class="text-center text-h5">สำรองข้อมูล</h1>
                    </v-card-title>
                    <v-card-text>
                        <div class="d-flex align-center">
                            <p class="text-body-2">เลือกตารางที่ต้องการสำรอง</p>
                            <v-btn variant="tonal" class="ms-2" color="primary" @click="reload()">โหลดรายชื่อตารางใหม่</v-btn>
                        </div>
                        
                        <v-alert v-if="error" class="mt-4" type="error" variant="tonal">{{ error }}</v-alert>
                        <template>
                            <p>ตารางในฐานข้อมูล: {{ tables.length }} | เลือกแล้ว: {{ select.length }}</p>
                            <v-btn variant="text" color="primary" :disabled="tables.length === 0" @click="toggleAll">{{ all ? 'ล้างการเลือก': 'เลือกทั้งหมด' }}</v-btn>
                            <v-row>
                                <v-col cols="12" md="6" v-for="table in tables">
                                    <v-checkbox  :key="table.name" :value="table.name" :label="table.name" v-model="select" color="primary"></v-checkbox>
                                </v-col>
                            </v-row>
                            <v-divider class="my-4"></v-divider>
                            <v-btn color="primary" prepend-icon="mdi-download" :loading="exporting" :disabled="select.length === 0" @click="backUp">สำรองข้อมูล</v-btn>
                        </template>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import { api, staff } from '~/API/base'

const tables = ref<{name:string}[]>([])
const select = ref<string[]>([])
const exporting = ref(false)
const token = import.meta.client ? localStorage.getItem('token'):null

const error = ref('')
const all = computed(()=> tables.value.length > 0 && select.value.length === tables.value.length)

const fetch = async()=>{
    try {
        const res = await axios.get(`${staff}/backup/show`,{headers:{Authorization:`Bearer ${token}`}})
        tables.value = res.data
    } catch (err:any) {
        console.error("error get",err);
        error.value = 'ไม่สามรถโหลดชื่อตารางได้'
    }
}

const toggleAll = ()=>{
    select.value = all.value ? [] : tables.value.map(table => table.name)
}

const backUp = async()=>{
    error.value = ''
    exporting.value = true
    try {
        const res = await axios.post(`${staff}/backup/save`,{tables:select.value},{headers:{Authorization:`Bearer ${token}`},responseType:'blob'})
        const filename = 'database-backup.sql'
        const url = URL.createObjectURL(new Blob([res.data],{type:'application/sql;charset=utf-8'}))
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        link.click()
        URL.revokeObjectURL(url)
    } catch (err:any) {
        console.error("Error export",err);
        error.value = 'ไม่สามารถสำรองข้อมูลได้'
        
    }finally{
        exporting.value = false
    }
}

const reload = ()=>{
    window.location.reload()
}

onMounted(fetch)

</script>

<style scoped>

</style>