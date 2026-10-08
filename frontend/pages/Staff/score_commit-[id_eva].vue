<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-card class="pa-5" v-if="user.status_eva === 3 || user.status_eva === 2">
                    <v-form >
                        <h1 class="font-weight-bold">ผลการประเมินของกรรมการประเมิน</h1>
                        <v-row v-for="(topic, t) in topics" :key="topic.id_topic">
                            <v-col cols="12">
                                <h1 class="font-weight-bold text-h5">{{ t + 1 }}.{{ topic.name_topic }}</h1>
                                <v-table class="table">
                                    <tr>
                                        <th class="border pa-1 bg-grey" style="width: 10%;" >ตัวชี้วัด</th>
                                        <th class="border pa-1 bg-grey" style="width: 10%;" >รายละเอียดตัวชี้วัด</th>
                                        <th class="border pa-1 bg-grey" style="width: 10%;" >น้ำหนักคะแนน</th>
                                        <th class="border pa-1 bg-grey" style="width: 10%;" >คะแนนเต็ม</th>
                                        <th class="border pa-1 bg-grey" style="width: 10%;" >ประธาน</th>
                                        <th class="border pa-1 bg-grey" style="width: 10%;" >กรรมการ</th>
                                        <th class="border pa-1 bg-grey" style="width: 10%;" >เลขา</th>
                                        <th class="border pa-1 bg-grey" style="width: 10%;" >คะแนนที่ได้</th>
                                    </tr>
                                    <tr v-for="(indicate, i) in topic.indicates" :key="indicate.id_indicate">
                                        <td class="text-center border pa-1" style="width: 10%;">{{ indicate.name_indicate }}</td>
                                        <td class="text-center border pa-1" style="width: 10%;">{{ indicate.detail_indicate }}</td>
                                        <td class="text-center border pa-1" style="width: 10%;">{{ indicate.point_indicate }}</td>
                                        <td class="text-center border pa-1" style="width: 10%;">{{ indicate.point_indicate*4 }}</td>
                                        <td class="text-center border pa-1" style="width: 10%;">{{ scores[indicate.id_indicate]?.a ?? 'รอกรรมการประเมิน' }}</td>
                                        <td class="text-center border pa-1" style="width: 10%;">{{ scores[indicate.id_indicate]?.b ?? 'รอกรรมการประเมิน' }}</td>
                                        <td class="text-center border pa-1" style="width: 10%;">{{ scores[indicate.id_indicate]?.c ?? 'รอกรรมการประเมิน' }}</td>
                                        <td class="text-center border pa-1" style="width: 10%;">{{ (((scores[indicate.id_indicate]?. a ?? 0)+(scores[indicate.id_indicate]?. b ?? 0)+(scores[indicate.id_indicate]?. c ?? 0))/3).toFixed(2) }}</td>
                                    </tr>
                                </v-table>
                            </v-col>
                        </v-row>
                        <div class="mt-5  py-4 text-end">
                            <v-card class="pa-5" color="green">คะแนนรวมสุทธิ : {{ ((user.total_commit)/3).toFixed(2) }} คะแนน</v-card>
                        </div>
                        <div class="mt-2">
                            <v-card class="pa-3">
                                <label for=""><h3>ข้อเสนอแนะของกรรมการ</h3></label>
                                <v-row>
                                    <v-col v-for="commit,c in commits" :key="commit.id_commit" cols="12">
                                        {{ c+1 }}.{{ commit.level_commit }} : {{ commit.detail_commit || 'รอการประเมิน' }}
                                    </v-col>
                                </v-row>
                            </v-card>
                        </div>
                    </v-form> 
                    
                </v-card>
                <v-alert variant="tonal" type="warning" v-else-if="user.status_eva === 1" >ยังไม่ได้ประเมินตนเอง</v-alert>
                <v-alert variant="tonal" type="error" v-else>ไม่มีแบบประเมิน</v-alert>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import axios, { all } from 'axios';
import { eva, staff } from '~/API/base';

const user = ref<any>({})
const topics = ref<any>([])
const commits =ref<any>([])
const scores =ref<any>([])
const id_eva = useRoute().params.id_eva
const fetch = async () => {
    const token = localStorage.getItem('token')
    try {
        const res = await axios.get(`${staff}/score_commit/user/${id_eva}`, { headers: { Authorization: `Bearer ${token}` } })
        user.value = res.data
    } catch (error) {
        console.error('error get user', error)
    }
}
const fetchTopic = async () => {
    const token = localStorage.getItem('token')
    try {
        const res = await axios.get(`${staff}/score_commit/topic/${id_eva}`, { headers: { Authorization: `Bearer ${token}` } })
        topics.value = res.data
    } catch (error) {
        console.error('error get user', error)
    }
}
const fetchCommit = async () => {
    const token = localStorage.getItem('token')
    try {
        const res = await axios.get(`${staff}/score_commit/commit/${id_eva}`, { headers: { Authorization: `Bearer ${token}` } })
        commits.value = res.data
    } catch (error) {
        console.error('error get user', error)
    }
}
const fetchScore = async () => {
    const token = localStorage.getItem('token')
    try {
        const res = await axios.get(`${staff}/score_commit/score/${id_eva}`, { headers: { Authorization: `Bearer ${token}` } })
        scores.value = res.data.scores
    } catch (error) {
        console.error('error get user', error)
    }
}
onMounted(async () => {
    await Promise.all([fetch(), fetchTopic(),fetchScore(),fetchCommit()])
})



</script>

<style scoped></style>