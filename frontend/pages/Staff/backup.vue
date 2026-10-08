<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="12">
                <v-card>
                    <v-card-title>
                        <h1 class="text-center text-h5">สำรองข้อมูล</h1>
                    </v-card-title>
                    <v-card-text>
                        <p class="text-body-2">เลือกตารางที่ต้องการสำรอง</p>
                        <v-alert v-if="error" class="mt-4" type="error" variant="tonal"></v-alert>
                        <template>
                            <p>ตารางในฐานข้อมูล: {{ tables.length }} | เลือกแล้ว: {{ select.length }}</p>
                            <v-btn variant="text" :disabled="tables.length === 0" @click="toggleAll">{{ all ? 'ล้างการเลือก': 'เลือกทั้งหมด' }}</v-btn>
                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-checkbox v-for="table in tables" :key="table.name" :value="table.name" :label="table.name" v-model="select" color="primary"></v-checkbox>
                                </v-col>
                            </v-row>
                            <v-divider ></v-divider>
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

const dataResult = ref([])
const error = ref<Record<string,string>>({})
const name_doc = ref('')
const file = ref<File | null>(null)
const search = ref('')

const token = import.meta.client ? localStorage.getItem('token'):null

const saveMember = async()=>{
    if(!name_doc.value || !file.value)return alert('กรอกข้อมูลให้ครบถ้วน')
    const maxSize = 10*1024*1024
    if(file.value.size > maxSize){
        alert("ไฟล์มีขนาดเกิน 10MB")
    }
    const formdata = new FormData
    formdata.append('name_doc',name_doc.value)
    formdata.append('file',file.value!)
    try {
        await axios.post(`${staff}/doc/save`,formdata,{headers:{Authorization:`Bearer ${token}`}})
        alert('ทำรายการสำเร็จ')
        name_doc.value = ''
        file.value = null
        await fetch()
    } catch (error) {
        console.error("error save",error);
        
    }
}

const fetch = async()=>{
    try {
        const res = await axios.get(`${staff}/doc/show`,{headers:{Authorization:`Bearer ${token}`}})
        dataResult.value = res.data
    } catch (error) {
        console.error("error get",error);
        
    }
}


const del = async(id_doc:number)=>{
    if(!confirm("ต้องการลบข้อมูลชุดนี้ใช่หรือไม่"))return
    try {
        await axios.delete(`${staff}/doc/delete/${id_doc}`,{headers:{Authorization:`Bearer ${token}`}})
        await fetch()
    } catch (error) {
        console.error("error delete",error);
        
    }
}

const result = computed(()=>{

    if(!search.value)return dataResult.value
    const s = search.value.toLowerCase()

    return dataResult.value.filter((items:any)=>{
        return(
            items.name_doc?.toLowerCase().includes(s)
        )
    })

})

const formatDate = (dateStr:string)=>{
    if(!dateStr)return '-'
    const date = new Date(dateStr)
    const day = String(date.getDate()).padStart(2,'0')
    const month = String(date.getMonth()+1).padStart(2,'0')
    const year = String(date.getFullYear()+1)

    return `${day}/${month}/${year}`
}

const view = (filename:string)=>{
    const url = new URL(`/uploads/document/${filename}`,api).href
    window.open(url,'_blank')
}

onMounted(fetch)

</script>

<style scoped>

</style>