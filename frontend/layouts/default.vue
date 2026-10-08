<template>
    <v-app>
        <v-app-bar :color="bg(user.role)" flat :elevation="5" class="rounded -b">
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title class="font-weight-bold">NTC Evaluation System</v-toolbar-title>
            <v-spacer></v-spacer>

            <p class="text-center">คุณ : {{ user.fname }} {{ user.lname }} <br> ตำแหน่ง : {{ user.role }}</p>
            <v-btn icon="mdi-logout" @click="logout" variant="text"></v-btn>
        </v-app-bar>

        <client-only>
            <v-navigation-drawer app color="#404040" width="260" v-model="drawer" :temporary="isMobile" :permanent="!isMobile"> 
                <v-list density="comfortable">
                    <v-list-item v-for="item in navitem" :key="item.title" :to="item.to">
                        <v-list-item-title>
                            {{ item.title }}
                        </v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-navigation-drawer>
        </client-only>

        <v-main>
            <v-container fluid class="py-2">
                <slot></slot>
            </v-container>
            <v-footer class="text-caption justify-center">© 2026 NTC Evaluation System</v-footer>
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import axios from 'axios'
import { useDisplay } from 'vuetify/lib/composables/display.mjs';
import { api } from '~/API/base';

const drawer = ref(false)
const user = ref<any>({})
const {mdAndDown} = useDisplay()
const isMobile = computed(()=> mdAndDown.value)

const logout = ()=>{
    if(!confirm('ท่านต้องการออกจากระบบใช่หรือไม่'))return
    localStorage.removeItem('token')
    navigateTo('/',{replace:true})
}
const roles = [
    {title:'หน้าหลัก',to:'/Staff/',role:'ฝ่ายบุคลากร'},
    {title:'จัดการผู้รับการประเมิน',to:'/Staff/Manage_eva',role:'ฝ่ายบุคลากร'},
    {title:'จัดการกรรมการประเมิน',to:'/Staff/Manage_commit',role:'ฝ่ายบุคลากร'},
    {title:'จัดการหัวข้อการประเมิน',to:'/Staff/topic',role:'ฝ่ายบุคลากร'},
    {title:'จัดการตัวชี้วัด',to:'/Staff/indicate',role:'ฝ่ายบุคลากร'},
    {title:'จัดการรอบการประเมิน',to:'/Staff/round',role:'ฝ่ายบุคลากร'},
    {title:'จัดการแบบการประเมิน',to:'/Staff/eva',role:'ฝ่ายบุคลากร'},
    {title:'ผลการประเมินของผู้รับการประเมินผล',to:'/Staff/score_evaList',role:'ฝ่ายบุคลากร'},
    {title:'ผลการประเมินของกรรมการประเมิน',to:'/Staff/score_commitList',role:'ฝ่ายบุคลากร'},
    {title:'สถานะการประเมินของผู้รับการประเมินผล',to:'/Staff/status_eva',role:'ฝ่ายบุคลากร'},
    {title:'สถานะการประเมินของกรรมการประเมิน',to:'/Staff/status_commit',role:'ฝ่ายบุคลากร'},
    {title:'เอกสารและคู่มือการประเมิน',to:'/Staff/document',role:'ฝ่ายบุคลากร'},
    {title:'รายงาน',to:'/Staff/report',role:'ฝ่ายบุคลากร'},
    {title:'สำรองข้อมูล',to:'/Staff/backup',role:'ฝ่ายบุคลากร'},
   
    {title:'หน้าหลัก',to:'/Evaluatee/',role:'ผู้รับการประเมินผล'},
    {title:'แก้ไขข้อมูลส่วนตัว',to:'/Evaluatee/edit_eva',role:'ผู้รับการประเมินผล'},
    {title:'แบบประเมินตนเอง',to:'/Evaluatee/selfeva',role:'ผู้รับการประเมินผล'},
    {title:'ตรวจสอบผลการประเมิน',to:'/Evaluatee/check_score',role:'ผู้รับการประเมินผล'},
    {title:'รายงาน',to:'/Evaluatee/report',role:'ผู้รับการประเมินผล'},
    {title:'คู่มือการประเมิน',to:'/Evaluatee/doc',role:'ผู้รับการประเมินผล'},
    
    {title:'รายชื่อผู้รับการประเมิน',to:'/Staff/',role:'กรรมการประเมิน'},
    {title:'ดำเนินการประเมิน',to:'/Staff/show_eva',role:'กรรมการประเมิน'},
    {title:'ตรวจสอบผลและยืนยัน',to:'/Staff/check_confirm',role:'กรรมการประเมิน'},
    {title:'คู่มือการประเมิน',to:'/Staff/doc',role:'กรรมการประเมิน'},
    
]

const navitem = computed(() => roles.filter((item)=> item.role.includes(user.value.role)))

const fetch = async()=>{
    const token = localStorage.getItem('token')
    if(!token){
        return navigateTo('/',{replace:true})
    }
    try {
        const res = await axios.get(`${api}/profile`,{headers:{Authorization:`Bearer ${token}`}})
        user.value = res.data
    } catch (error) {
        console.error('Error Get Profile!!!',error)
        localStorage.removeItem('token')
        navigateTo('/',{replace:true})
    }
}
onMounted(fetch)

const bg = (role:string) =>{
    if(role === 'ฝ่ายบุคลากร')return '#647687'
    if(role === 'กรรมการประเมิน')return '#007FFF'
    if(role === 'ผู้รับการประเมินผล')return '#7d0c14'
}
</script>

<style scoped>
@media print {
    .v-app-bar,.v-btn.no-p{
        display: none !important;
        margin: 0 !important;
        margin-top: 0 !important;
        padding: 0 !important;
        width: 100% !important;
    }
}
</style>