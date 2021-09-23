<template>
    <div class="container-fluid calendar">
        <div class="row">
            <div class="col-md-12">
                <v-calendar
                    disable-page-swipe
                    is-expanded 
                    :attributes='attributes'
                    @dayclick='dayClicked'
                />
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="show-dates">
                    <div class="header">
                        Schedule of date : {{this.selectedDate}}
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
            </div>
        </div>

        <div class="add-circle" @click="()=>{this.$router.push('/add-calendar')}"> <i class="fa fa-plus"></i></div>
        
    </div>
</template>

<style scoped>
.calendar{
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
.add-circle{
    position: fixed;
    bottom: 80px;
    right: 30px;
    z-index: 100;
    color: white;
    background-color: gray;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    padding: 18px 25px;
    box-shadow: 2px 2px 2px #f1f1f1;
}
</style>

<script>
export default {
    name: 'Calendar',
    data(){
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = yyyy + '/' + mm + '/' + dd;
        return{
            addState: false,
            selectedDate: today,
            attributes: [
                {
                    key: 'today',        
                    highlight: true,
                    dates: today,
                    description: "Today is "+today
                }
            ],
            err: null
        }
    },
    mounted(){
        let date;
        if(this.attributes[0].key == 'today')
            date = this.selectedDate;
        
        this.showTodaysMeetings(date);
    },
    methods:{
        dayClicked(day){
            this.selectedDate = day.id;
            let val = {};
            val.key = "Selected Date";
            val.dates = day.id;
            val.highlight = true;
            val.color = "red";
            val.bar = true;
            this.attributes = this.attributes.filter((row)=>{
                if(row.key=='today'){
                    return row;
                }
            });
            this.attributes.push(val);
            this.showTodaysMeetings(this.selectedDate)
            
            
        },
        closeAdd(){
            this.addState = false;
        },
        addDate(val){
            val.highlight = true;
            try{
                this.axios.post('http://34.136.2.190:3000/mr/calander',{
                    val
                }, {
                    headers:{
                        token: localStorage.token
                    }
                }).then(res=>{
                    if(res.data.flag==true && res.data.id>0){
                        this.attributes.push(val);
                    }else{
                        this.err = "Something went wrong please try again";
                    }
                    
                    
                }).catch(err=> {
                    console.log(err);
                    this.err = err;
                })
            }
            catch (err){
                this.err = err;
            }
            
            
            this.addState = false;
        },
        showTodaysMeetings(date){
            try{

               this.axios.get('http://34.136.2.190:3000/mr/calander', {
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