<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-form v-if="user.status_eva === 3 || user.status_eva === 2">
                    <h1 class="font-weight-bold">ผลการประเมินของกรรมการประเมิน</h1>
                    <v-row v-for="(topic, t) in topics" :key="topic.id_topic">
                        <v-col cols="12">
                            <h1 class="font-weight-bold text-h5">{{ t + 1 }}.{{ topic.name_topic }}</h1>
                            <v-table class="table">
                                <tr>
                                    <th class="boder pa-1 bg-grey" style="width: 10%;" >ตัวชี้วัด</th>
                                    <th class="boder pa-1 bg-grey" style="width: 10%;" >รายละเอียดตัวชี้วัด</th>
                                    <th class="boder pa-1 bg-grey" style="width: 10%;" >น้ำหนักคะแนน</th>
                                    <th class="boder pa-1 bg-grey" style="width: 10%;" >คะแนนเต็ม</th>
                                    <th class="boder pa-1 bg-grey" style="width: 10%;" >คะแนนที่ได้</th>
                                </tr>
                                <tr v-for="(indicate, i) in topic.indicates" :key="indicate.id_indicate">
                                    <td class="text-center boder pa-1" style="width: 10%;">{{ indicate.name_indicate }}</td>
                                    <td class="text-center boder pa-1" style="width: 10%;">{{ indicate.detail_indicate }}</td>
                                    <td class="text-center boder pa-1" style="width: 10%;">{{ indicate.point_indicate }}</td>
                                    <td class="text-center boder pa-1" style="width: 10%;">{{ indicate.point_indicate*4 }}</td>
                                    <td class="text-center boder pa-1" style="width: 10%;">{{ (((scores[indicate.id_indicate]?. a ?? 0)+(scores[indicate.id_indicate]?. b ?? 0)+(scores[indicate.id_indicate]?. c ?? 0))/3).toFixed(2) }}</td>
                                </tr>
                            </v-table>
                        </v-col>
                    </v-row>
                    <div class="mt-5 pa-5 py-4 text-end">
                        <v-card color="green">คะแนนรวมสุทธิ : {{ ((user.total_commit)/3).toFixed(2) }} คะแนน</v-card>
                    </div>
                    <div class="mt-2">
                        <v-card class="pa-2">
                            <label for="">ข้อเสนอแนะของกรรมการ</label>
                            <v-row>
                                <v-col v-for="commit,c in commits" :key="commit.id_commit" cols="12">
                                    <img :src="`http://localhost:3001/uplaods/signature/${commit.signature}`" :alt="`รอ${commit.level_commit}ประเมิน`" width="20%"> <br>
                                        (({{ commit.fname }} {{ commit.lname }})) <br>
                                        {{ commit.level_commit }}
                                </v-col>
                            </v-row>
                        </v-card>
                    </div>
                    <div class="mt-3 text-center">
                        <v-btn color="warning" class="no-p" @click="print">พิมพ์</v-btn>
                    </div>
                </v-form> 
                <v-alert variant="tonal" type="warning" v-else-if="user.status_eva === 1" >ยังไม่ได้ประเมินตนะเอง</v-alert>
                <v-alert variant="tonal" type="error" v-else>ไม่มีแบบประเมิน</v-alert>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import axios, { all } from 'axios';
import { eva } from '~/API/base';

const user = ref<any>({})
const topics = ref<any>([])
const commits =ref<any>([])
const scores =ref<any>([])

const print = ()=>{
    window.print()
}

const fetch = async () => {
    const token = localStorage.getItem('token')
    try {
        const res = await axios.get(`${eva}/selfeva/user`, { headers: { Authorization: `Bearer ${token}` } })
        user.value = res.data
    } catch (error) {
        console.error('error get user', error)
    }
}
const fetchTopic = async () => {
    const token = localStorage.getItem('token')
    try {
        const res = await axios.get(`${eva}/selfeva/topic`, { headers: { Authorization: `Bearer ${token}` } })
        topics.value = res.data
    } catch (error) {
        console.error('error get user', error)
    }
}
const fetchCommit = async () => {
    const token = localStorage.getItem('token')
    try {
        const res = await axios.get(`${eva}/score_commit/commit`, { headers: { Authorization: `Bearer ${token}` } })
        commits.value = res.data
    } catch (error) {
        console.error('error get user', error)
    }
}
const fetchScore = async () => {
    const token = localStorage.getItem('token')
    try {
        const res = await axios.get(`${eva}/score_commit/score`, { headers: { Authorization: `Bearer ${token}` } })
        scores.value = res.data
    } catch (error) {
        console.error('error get user', error)
    }
}
onMounted(async () => {
    await Promise.all([fetch(), fetchTopic(),fetchScore(),fetchCommit()])
})



</script>

<style scoped></style>