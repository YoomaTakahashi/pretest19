<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="12">
                <v-card>
                    <v-card-title>
                        <h1 class="text-center text-h5">จัดการแบบการประเมิน</h1>
                    </v-card-title>
                    <v-card-text>
                        <br>
                        <v-form @submit.prevent="saveMember">
                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-select label="ผู้รับการประเมินผล" v-model="form.id_member" :error-messages="error.id_member" :items="eva.map((t)=>({title:`${t.fname} ${t.lname}`,value:t.id_member}))"></v-select>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-select label="รอบการประเมิน" v-model="form.id_sys" :error-messages="error.id_sys" :items="round.map((t)=>({title:`รอบการประเมินที่:${t.round_sys} ปี:${t.year_sys}`,value:t.id_sys}))"></v-select>
                                </v-col>
                                <v-col cols="12" md="12">
                                    <v-text-field label="วันที่ออกแบบประเมิน" v-model="form.day_eva" :error-messages="error.day_eva" type="date"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" md="12">
                                    <center>
                                        <v-btn class="text-center ma-2" color="primary" type="submit">{{ form.id_eva ? 'อัปเดต' : 'บันทึก' }}</v-btn>
                                        <v-btn class="text-center ma-2" color="error" type="reset">ยกเลิก</v-btn>
                                    </center>
                                </v-col>
                            </v-row>
                        </v-form>
                        <v-text-field label="ค้นหา" placeholder="ค้นหา" v-model="search" prepend-inner-icon="mdi-magnify" class="mt-3"></v-text-field>
                        <v-table class="mt-3">
                            <thead>
                                <tr>
                                    <th class="border text-center">ลำดับ</th>
                                    <th class="border text-center">ผู้รับการประเมินผล</th>
                                    <th class="border text-center">รอบการประเมิน</th>
                                    <th class="border text-center">วันที่ออกแบบประเมิน</th>
                                    <th class="border text-center">เพิ่มกรรมการ</th>
                                    <th class="border text-center">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_eva">
                                    <td class="border text-center">{{ index+1 }}</td>
                                    <td class="border text-center">{{ items.fname}} {{ items.lname }}</td>
                                    <td class="border text-center">รอบการประเมินที่:{{items.round_sys}} ปี:{{ items.year_sys }}</td>
                                    <td class="border text-center">{{ formatDate(items.day_eva) }}</td>
                                    <td class="border text-center">
                                        <v-btn class="text-center text-white ma-2" color="success" @click="go(items.id_eva)">เพิ่มกรรมการ</v-btn>
                                    </td>
                                    <td class="border text-center">
                                        <center>
                                            <v-btn class="text-center text-white ma-2" color="warning" @click="edit(items)">แก้ไข</v-btn>
                                            <v-btn class="text-center text-white ma-2" color="error" @click="del(items.id_eva)">ลบ</v-btn>
                                        </center>
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
import { api, staff } from '~/API/base'

const eva = ref([])
const round = ref([])
const dataResult = ref([])
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

const fetch = async()=>{
    try {
        const res = await axios.get(`${staff}/eva/show`,{headers:{Authorization:`Bearer ${token}`}})
        dataResult.value = res.data

        const res2 = await axios.get(`${staff}/system/show`,{headers:{Authorization:`Bearer ${token}`}})
        round.value = res2.data

        const res3 = await axios.get(`${staff}/member/showE`,{headers:{Authorization:`Bearer ${token}`}})
        eva.value = res3.data
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

const go = (id_eva:number)=>{
    navigateTo({path:`/Staff/commit-eva-${id_eva}`})
}

const formatDate = (dateStr:string)=>{
    if(!dateStr)return '-'
    const date = new Date(dateStr)
    const day = String(date.getDate()).padStart(2,'0')
    const month = String(date.getMonth()+1).padStart(2,'0')
    const year = String(date.getFullYear()+1)

    return `${day}/${month}/${year}`
}

const result = computed(()=>{

    if(!search.value)return dataResult.value
    const s = search.value.toLowerCase()

    return dataResult.value.filter((items:any)=>{
        return(
            items.fname?.toLowerCase().includes(s) || 
            items.lname?.toLowerCase().includes(s)
        )
    })

})

onMounted(fetch)

</script>

<style scoped>

</style>