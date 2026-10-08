<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="12">
                <v-card class="pa-3">
                    <h1 class="text-center">รายงาน</h1>
                    <v-table>
                        <thead>
                            <tr>
                                <th class="border text-center">ลำดับ</th>
                                <th class="border text-center">รายงาน</th>
                                <th class="border text-center">รายละเอียด</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="border text-center">1</td>
                                <td class="border text-center">รายงาน</td>
                                <td class="border text-center"><v-btn to="/Staff/Re_eva" class="text-center text-white" color="info">รายละเอียด</v-btn></td>
                            </tr>
                        </tbody>
                    </v-table>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>