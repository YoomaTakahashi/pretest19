<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="12">
                <v-card class="mb-3">
                    <v-card-title><h1 class="text-center">ผู้รับการประเมินผล</h1></v-card-title>
                    <v-card-text>
                        <p>ชื่อ-นามสกุล: {{ header.fname }} {{ header.lname }}</p>
                        <p>รอบการประเมิน: {{ header.round_sys }} ปี:{{ header.year_sys }}</p>
                    </v-card-text>
                </v-card>
                <v-card>
                    <v-card-title>
                        <h1 class="text-center text-h5">สถานะการประเมินของกรรมการประเมิน</h1>
                    </v-card-title>
                    <v-card-text>
                        <br>
                        <!-- <v-text-field label="ค้นหา" placeholder="ค้นหา" v-model="search" prepend-inner-icon="mdi-magnify" class="mt-3"></v-text-field> -->
                        <v-table class="mt-3">
                            <thead>
                                <tr>
                                    <th class="border text-center">ลำดับ</th>
                                    <th class="border text-center">กรรมการประเมิน</th>
                                    <th class="border text-center">ตำแหน่ง</th>
                                    <th class="border text-center">สถานะการประเมิน</th>
                                    <!-- <th class="border text-center">รายละเอียด</th> -->
                                    
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_eva">
                                    <td class="border text-center">{{ index+1 }}</td>
                                    <td class="border text-center">{{ items.fname}} {{ items.lname }}</td>
                                    <td class="border text-center">{{items.level_commit}}</td>
                                    <td class="border text-center"><v-btn class="text-center" :color="bg(items.status_commit)">{{ items.status_commit === 'y' ? 'ประเมินแล้ว':'รอการประเมิน'}}</v-btn></td>
                                    <!-- <td class="border text-center">
                                        <v-btn class="text-center text-white ma-2" color="info" @click="go(items.id_eva)">รายละเอียด</v-btn>
                                    </td> -->
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
import { api, staff } from '~/API/base'

const header = ref([])
const result = ref([])
const error = ref<Record<string,string>>({})
const search = ref('')
const form = ref({
    id_eva:null,
    id_member:'',
    id_sys:'',
    day_eva:''
})

const reset = ()=>{
    form.value ={
        id_eva:null,
        id_member:'',
        id_sys:'',
        day_eva:''
    }
}

const emailRegex = /^[^\s]+@[^\s]+\.[^\s]{2,}$/i
function validateForm(){

    const f = form.value
    error.value = {}

    if(!f.id_member)error.value.id_member = 'กรุณาเลือกผู้รับการประเมินผล'
    if(!f.id_sys)error.value.id_sys = 'กรุณาเลือกรอบการประเมิน'
    if(!f.day_eva)error.value.day_eva = 'กรุณากรอกวันที่ออกแบบประเมิน'

    return Object.keys(error.value).length === 0
}

const token = import.meta.client ? localStorage.getItem('token'):null

const saveMember = async()=>{
    if(!validateForm())return
    const f = form.value
    try {
        f.id_eva
        ?await axios.put(`${staff}/eva/update/${f.id_eva}`,form.value,{headers:{Authorization:`Bearer ${token}`}})
        :await axios.post(`${staff}/eva/save`,form.value,{headers:{Authorization:`Bearer ${token}`}})
        alert('ทำรายการสำเร็จ')
        await fetch()
        await reset()
    } catch (error) {
        console.error("error save",error);
        
    }
}
const id_eva = useRoute().params.id_eva
const fetch = async()=>{
    try {
        const res = await axios.get(`${staff}/commit/header/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        header.value = res.data

        const res3 = await axios.get(`${staff}/status/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        result.value = res3.data
    } catch (error) {
        console.error("error get",error);
        
    }
}

const edit = (items:any)=>{
    form.value = {...items}
}

const del = async(id_eva:number)=>{
    if(!confirm("ต้องการลบข้อมูลชุดนี้ใช่หรือไม่"))return
    try {
        await axios.delete(`${staff}/eva/delete/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        await fetch()
        await reset()
    } catch (error) {
        console.error("error delete",error);
        
    }
}


const formatDate = (dateStr:string)=>{
    if(!dateStr)return '-'
    const date = new Date(dateStr)
    const day = String(date.getDate()).padStart(2,'0')
    const month = String(date.getMonth()+1).padStart(2,'0')
    const year = String(date.getFullYear()+1)

    return `${day}/${month}/${year}`
}

// const result = computed(()=>{

//     if(!search.value)return dataResult.value
//     const s = search.value.toLowerCase()

//     return dataResult.value.filter((items:any)=>{
//         return(
//             items.fname?.toLowerCase().includes(s) || 
//             items.lname?.toLowerCase().includes(s)
//         )
//     })

// })

const bg = (status_commit:string)=>{
    if(status_commit === 'n')return 'error'
    else if(status_commit === 'y')return 'success'
}

const go = (id_eva:number)=>{
    navigateTo({path:`/Staff/status_commit2-${id_eva}`})
}

onMounted(fetch)

</script>

<style scoped>

</style>