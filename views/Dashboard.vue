<template>
    <div class="container-fluid dashboard">
        <div class="row">
            <div class="col-md-12">
                <div class="show-dates" v-if="attributes.length>0">
                    <div class="header">
                        Upcoming Meetings
                    </div>
                    <div class="body">
                        <div class="meeting-box" v-for="attr in attributes" :key="attr.key" @click="showMeeting(attr)">
                            <div class="meeting-head">
                                <span> <i class="fa fa-calendar"></i></span>
                                {{attr.key}}
                            </div>
                            <div class="meeting-body">
                                {{attr.dates}}

                                {{attr.time}}
                                <br/>
                                {{attr.description}}
                                <br/>

                                <div class="status" v-if="attr.meeting_status">
                                    <i class="fa fa-circle scheduled"></i>
                                    {{attr.meeting_status}}
                                </div>

                            </div>
                            
                        </div>
                    </div>
                    
                </div>
                <div class="no-meeting" v-else>
                    <p>No upcoming Meetings</p>            
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.dashboard{
    padding-top: 80px;
}
.body-item{
    border: 1px solid #f1f1f1;
    border-radius: 5px;
    margin: 10px 5px;
    padding: 10px;
}
.show-dates{
    margin-bottom: 100px;
}
.meeting-box{
    margin: 10px;
    border:1px solid #f1f1f1;
    border-radius: 5px;
}
.meeting-head{
    padding: 10px;
    text-align: center;
    border-bottom: 1px solid #f1f1f1;
}
.meeting-head span{
    float: left;
    
}
.meeting-body{
    padding: 10px;
}
.meeting-body button{
    margin-top: 20px;
}
.scheduled{
    color: gray;
}
.started{
    color: green;
}
.finished{
    color: blue;
}
.canceled{
    color: red;   
}
.no-meeting{
    text-align: center;
    border: 1px solid #f1f1f1;
    border-radius: 5px;
    padding: 20px;
}
</style>

<script>
export default {
    name: "Dashboard",
    data(){
        return{
            attributes: [],
            err: null
        }
    },
    mounted(){
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = yyyy + '/' + mm + '/' + dd;
        this.showUpcomingMeetings(today);
    },
    methods:{
        
        showUpcomingMeetings(date){
            try{

               this.axios.get('http://34.136.2.190:3000/mr/calander/upcoming', {
                    headers:{ token: localStorage.token},
                    params: {date: date}

                }).then(res=>{
                    
                    if(res.data.length>0){
                        
                        res.data.forEach((d)=>{
                            d.dates = new Date(d.dates);
                            d.highlight= true,
                            this.attributes.push(d)
                        });
                        console.log(this.attributes);
                    }
                }).catch( err => {
                    this.err = err;
                })     

            }
            catch(e){
                this.err = e;
                console.error(e);
            }
        },
        showMeeting(attr){
            if(attr.id){
                this.$router.push('/show-meeting/'+attr.id);
            }
        }
    }
}
</script>