<template>
    <div class="profile">
        
            <div class="form-item">
                <button class="btn btn-basic" @click="()=>{this.$router.push('/my-meetings')}"> <span><i class="fa fa-calendar"></i> My Meetings</span> <span class="left-arrow"><i class="fa fa-angle-right"></i></span></button>
            </div>
            <div class="form-item">
                <button class="btn btn-basic" @click="()=>{this.$router.push('/my-favorite')}"><span><i class="fa fa-heart"></i> My Favorites</span> <span class="left-arrow"> <i class="fa fa-angle-right"></i> </span></button>
            </div>
            <div class="form-item">
                <button class="btn btn-basic" @click="()=>{this.$router.push('/my-profile')}"><span><i class="fa fa-user"></i> My Profile</span> <span class="left-arrow"><i class="fa fa-angle-right"></i> </span></button>
            </div>
            <div class="form-item">
                <button class="btn btn-basic" @click="()=>{this.$router.push('/my-drugs')}"><span><i class="fa fa-capsules"></i> My Drugs</span> <span class="left-arrow"><i class="fa fa-angle-right"></i> </span></button>
            </div>
            
        
    </div>    
    
</template>

<style scoped>
.profile{
    padding: 50px 20px;
    
}
.profile-pic{
    display: flex;
    justify-content: center;
    margin: 20px;
}
.circle{
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: darkseagreen;
}
.edit{
    position: relative;
    bottom: -70px;
    right: 35px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    box-shadow: 1px 2px 2px #f1f1f1;
    background-color: white;
    padding: 5px 7px;
    z-index: 1; 
}
.form-item{
    margin: 20px 0px;
}
input, textarea, select{
    outline: none !important;
    box-shadow: none;
}
input:focus, textarea:focus, select:focus{
    outline: none !important;
    box-shadow: none;
    border:1px solid darkseagreen;
}
.phone-front{
    border-right: 0.05rem solid gray;
    position: relative;
    bottom: -40px;
    left: -65px;
    padding: 9px;
}
.phone-input{
    text-indent: 60px;
}
.btn-basic{
    border: 1px solid #c1c1c1;
    width: 100%;
    height: 50px;
    color: gray;
    font-size: 18px;
}
.btn-basic span{
    float: left;
}
.btn-basic .left-arrow{
    float: right;
    font-size: 20px;
    font-weight: bold;
}
</style>

<script>
//import Filter from '@/components/Filter.vue'
export default {
  
    name: 'Profile',
    // components:{
    //     'profile-filter': Filter
    // },
    props:{
        profile: Boolean
    },
    data(){
        return{
            filter: false,
            profileData: null

        };
        

    },
    methods:{
        showFilter(){
            this.filter = !this.filter;
        },
        closeFilter(val){
            this.filter= val;
        },
        getProfile(){
            this.axios.get('http://34.136.2.190:3000/mr', {
                headers:{
                     token: localStorage.token
                }
            }).then((res)=>{
                console.log(res.data[0]);
                this.profileData = res.data[0];
            });  
        },

        // updateProfile(variable, value){

        // }

    },
    mounted(){
        this.getProfile();
    }
}
</script>