<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="12">
                <v-card color="#404040">
                    <v-card-title>
                        <h1 class="text-center text-h5">แก้ไขข้อมูลส่วนตัว</h1>
                    </v-card-title>
                    <v-card-text class="bg-white">
                        <br>
                        <v-form @submit.prevent="saveMember">
                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-text-field variant="solo-filled" label="ชื่อ" v-model="form.fname" :error-messages="error.fname"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field variant="solo-filled" label="นามสกุล" v-model="form.lname" :error-messages="error.lname"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field variant="solo-filled" label="อีเมล" v-model="form.email" :error-messages="error.email" prepend-inner-icon="mdi-email"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field variant="solo-filled" label="ชื่อผู้ใช้" v-model="form.username" :error-messages="error.username" prepend-inner-icon="mdi-account"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field variant="solo-filled" label="รหัสผ่าน" v-model="form.password" :error-messages="error.password" :prepend-inner-icon="show ? 'mdi-eye':'mdi-eye-off'" :type="showPw ? 'text':'password'" @click:prepend-inner="show = !show , showPw = !showPw"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field variant="solo-filled" label="ยืนยันรหัสผ่าน" v-model="conP" :error-messages="error.conP" :prepend-inner-icon="show2 ? 'mdi-eye':'mdi-eye-off'" :type="showPw2 ? 'text':'password'" @click:prepend-inner="show2 = !show2 , showPw2 = !showPw2"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="12">
                                    <v-alert icon="mdi-account" variant="tonal" >{{ form.role }}</v-alert>
                                </v-col>
                                
                            </v-row>
                            <v-row>
                                <v-col cols="12" md="12">
                                    <center>
                                        <v-btn class="text-center ma-2" color="primary" type="submit">แก้ไข</v-btn>
                                        <v-btn class="text-center ma-2" color="error" type="reset">ยกเลิก</v-btn>
                                    </center>
                                </v-col>
                            </v-row>
                        </v-form>
                        
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import { eva } from '~/API/base'



const error = ref<Record<string,string>>({})
const pic_user = ref<File | null>(null)
const conP = ref('')
const typeR = ['ฝ่ายบุคลากร','ผู้รับการประเมินผล','กรรมการประเมิน']
const form = ref({
    fname:'',
    lname:'',
    email:'',
    username:'',
    password:'',
    role:''
})
const show = ref(false)
const show2 = ref(false)
const showPw = ref(false)
const showPw2 = ref(false)

const emailRegex = /^[^\s]+@[^\s]+\.[^\s]{2,}$/i
function validateForm(){

    const f = form.value
    error.value = {}

    if(!f.fname.trim())error.value.fname = 'กรุณากรอกชื่อ'
    if(!f.lname.trim())error.value.lname = 'กรุณากรอกนามสกุล'
    if(!f.email.trim())error.value.email = 'กรุณากรอกอีเมล'
    else if(!emailRegex.test(f.email.trim()))error.value.email = 'กรุณากรอกอีเมลให้ถูกต้อง'

    if(!f.username.trim())error.value.username = 'กรุณากรอกชื่อผู้ใช้'
    else if(f.username.trim().length < 4)error.value.username = 'ชื่อผู้ใช้ต้องยาวอย่างน้อย 4 ตัวอักษร'

    if(!f.password){
         return Object.keys(error.value).length === 0
    }else{
        if(f.password.trim().length < 6)error.value.password = 'รหัสผ่านต้องยาวอย่างน้อย 4 ตัวอักษร'
        else if(f.password.trim() != conP.value.trim())error.value.conP = 'รหัสผ่านไม่ตรงกัน'
    }
    

    if(!f.role.trim())error.value.role = 'กรุณาเลือกประเภทสมาชิก'

    return Object.keys(error.value).length === 0
}

const saveMember = async()=>{
    const token = localStorage.getItem('token')
    if(!validateForm())return
    try {
        await axios.put(`${eva}/edit_eva`,form.value,{headers:{Authorization:`Bearer ${token}`}})
        alert('ทำรายการสำเร็จ')
        window.location.reload()
    } catch (error) {
        console.error("error edit",error);
        
    }
}

const fetch = async()=>{
    const token = localStorage.getItem('token')
    try {
        const res = await axios.get(`${eva}/edit_eva`,{headers:{Authorization:`Bearer ${token}`}})
        form.value = res.data
    } catch (error) {
        console.error('Error get profile',error)
    }
}

onMounted(fetch)
</script>

<style scoped>

</style>