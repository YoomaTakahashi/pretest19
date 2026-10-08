<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="12">
                <v-card>
                    <v-card-title>
                        <h1 class="text-center text-h5">ยืนยันผลการประเมิน</h1>
                    </v-card-title>
                    <v-card-text>
                        <br>
                        <v-form v-if="!result.signature" @submit.prevent="saveMember">
                            <v-row>
                                <v-col cols="12" md="12">
                                    <v-file-input label="เอกสาร" v-model="file"  prepend-inner-icon="mdi-file" accept=".pdf" hint="รองรับเฉพาะไฟล์ PDF ขนาดไม่เกิน 10MB" persistent-hint></v-file-input>
                                </v-col>
                                
                            </v-row>
                            <v-row>
                                <v-col cols="12" md="12">
                                    <center>
                                        <v-btn class="text-center ma-2" color="primary" type="submit">บันทึก</v-btn>
                                        <v-btn class="text-center ma-2" color="error" type="reset">ยกเลิก</v-btn>
                                    </center>
                                </v-col>
                            </v-row>
                        </v-form>
                        <v-table  class="mt-3">
                            <thead>
                                <tr>
                                    <th class="border text-center">ลำดับ</th>
                                    <th class="border text-center">เอกสาร</th>
                                    <th class="border text-center">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="border text-center">{{ 1 }}</td>
                                    <td class="border text-center">{{ result.signature }}</td>
                                    <td class="border text-center">
                                        <v-btn class="text-center text-white ma-2" color="warning" prepend-icon="mdi-eye" @click="view(result.signature)">เปิดดู</v-btn>
                                        <v-btn class="text-center text-white ma-2" color="error"  @click="del(result.id_eva)">ลบ</v-btn>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="text-center text-red" colspan="12" v-if="result.length === 0">ไม่พบข้อมูล</td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import { api, commit, staff } from '~/API/base'

const dataResult = ref([])
const error = ref<Record<string,string>>({})
const name_doc = ref('')
const file = ref<File | null>(null)
const search = ref('')
const id_eva = useRoute().params.id_eva

const token = import.meta.client ? localStorage.getItem('token'):null

const saveMember = async()=>{
    const maxSize = 10*1024*1024
    if(file.value.size > maxSize){
        alert("ไฟล์มีขนาดเกิน 10MB")
    }
    const formdata = new FormData
    formdata.append('name_doc',name_doc.value)
    formdata.append('file',file.value!)
    try {
        await axios.post(`${commit}/signature/${id_eva}`,formdata,{headers:{Authorization:`Bearer ${token}`}})
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
        const res = await axios.get(`${commit}/signature/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        result.value = res.data
    } catch (error) {
        console.error("error get",error);
        
    }
}


const del = async(id_doc:number)=>{
    if(!confirm("ต้องการลบข้อมูลชุดนี้ใช่หรือไม่"))return
    try {
        await axios.delete(`${commit}/signature/${id_doc}`,{headers:{Authorization:`Bearer ${token}`}})
        alert('ลบสำเร็จ')
        await fetch()
        window.location.reload()
    } catch (error) {
        console.error("error delete",error);
        
    }
}

const result = ref([])


const view = (filename:string)=>{
    const url = new URL(`/uploads/signature/${filename}`,api).href
    window.open(url,'_blank')
}

onMounted(fetch)

</script>

<style scoped>

</style>