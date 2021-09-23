<template>
    <div class="notification">
        <div class="read">
            <p @click=" markAllRead()">Mark All Read</p>
        </div>
        <div v-if="notification.length==0">
            <center>No new notification for now.</center>
        </div>
        <div class="notification-item" v-for="notif in notification" :key="notif.id">
            <div class="notification-icon"><i class="fa fa-bell"></i></div>
            <div class="notification-body">
                {{notif.message}}
                <br/>
                {{ISOToDate(notif.date)}}, {{notif.time}}
            </div>
        </div>
    </div>    
</template>

<style scoped>
    .notification{
        padding: 60px 10px;
    }
    .notification-item{
        margin: 10px 0px;
        width: 100%;
        height: 100px;
        border-radius: 5px;
        border: 1px solid #f1f1f1;

    }
    .notification-icon{
        width: 20%;
        height: 100%;
        border-right: 1px solid #f1f1f1;
        padding: 40px 0px;
        float: left;
        display: flex;
        justify-content: center;

    }
    .notification-body{
        padding: 30px 20px;
        float: left;
        width: 80%;
        height: 100%;
    }
    .read{
        width: 100%;
        height: 40px;
        color: blue;
        margin: 10px 0px;
    }
    .read p{
        float: right;
    }

</style>

<script>
import moment from 'moment';
export default {
    name: 'Notification',
    data(){
        return{
            notification: null
        }
        
    },
    mounted(){
        this.getNotification();
    },
    methods:{
        async getNotification(){
            try{
                this.axios.get('http://34.136.2.190:3000/mr/notification', {
                    headers: {token: localStorage.getItem('token')}
                }).then(res=>{
                    this.notification = res.data;
                }).catch(e=>{
                    this.err = e;
                })
            }
            catch(e){
                this.err = e;
            }
        },
        markAllRead(){
            try{
                this.axios.put('http://34.136.2.190:3000/mr/notification', {},{
                    headers: {token: localStorage.getItem('token')}
                }).then(res=>{
                    if(res.data.flag==true){
                        this.getNotification();
                    }
                }).catch(e=>{
                    this.err = e;
                })
            }
            catch(e){
                this.err =e;
            }
        },

        ISOToDate(date){
            return moment(date).format("YYYY-MM-DD");
        },
    },

    
}
</script>