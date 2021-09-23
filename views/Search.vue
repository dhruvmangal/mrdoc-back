<template>
    <div class="search">
        <div class="search-tool">
            <button class="btn sort"><i class="fa fa-sort"></i></button>
            <form @submit="filterCall({name: searchName})">
                
                <input type="text" name="search" class="form-control search-input" placeholder="Search Doctors" v-model="searchName">
                <span class="btn search-icon"><i class="fa fa-search"></i></span>
            </form>
            <button class="btn filter" @click="toggleFilter()"><i class="fa fa-filter"></i></button>
        </div>
        <div class="search-result">
            <div class="result" @click="getDoctors()"> <p>Clear Filter</p></div>
            <div class="search-0-result" v-if="doctors.length==0">
                Not Found. Please search with different filters
            </div>
            <div class="search-result-card" v-for="item in doctors" :key="item.id">
                <div class="profile-pic-panel">
                    <div class="profile-pic" v-if="item.profile==null"  @click="showDoctor(item)"></div>
                    <div class="name"  @click="showDoctor(item)">{{item.name}}</div>
                    <div class="favorite" @click="favorite(item)"><i class="fa fa-heart" :class="{'heart-o': item.favorite, 'heart': !item.favorite}"></i></div>
                </div>
                <div class="profile-body"  @click="showDoctor(item)">
                    <div class="beacon"> <i class="fa fa-first-aid"></i> {{item.category}}</div>
                    <div class="beacon"> <i class="fa fa-briefcase"></i> {{item.clinic}}</div>
                    <div class="beacon"> <i class="fa fa-map-marker"></i> {{item.city}}</div>
                </div>
                
            </div>
        </div>
        <filter-search v-if="filterFlag==true" @toggleFilter="toggleFilter" @filter="filterCall($event)"></filter-search>
    </div>
</template>

<style scoped>
.search{
    padding: 60px 20px;
}
.search-tool{
    width:100%;
    height: 70px;
}
.sort, .filter{
    border:1px solid  #f1f1f1;
    width:14%;
    float: left;
    margin:0px 1%;
    color: gray;
}

.search-input{
    float: left;
    width:55%;
    margin:0px 1%;
    margin-right:0px;
    outline: none;
    border-color: #f1f1f1;
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
    border-right: 0px;
}
.search-input:focus, .search-icon{
    outline: none;
    box-shadow: none;
    
}
.search-input::placeholder{
    color: #c1c1c1;
}
.search-icon{
    float: left;
    border-color: #f1f1f1;
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
    border-left: 0px;
    width:10%;
    color: gray;
    padding-left: 5px;
}
.search-result-card{
    width:100%;
    height:auto;
    border:1px solid #f1f1f1;
    border-radius: 5px;
    margin: 10px 0;
    padding: 10px;
}
.profile-pic-panel{
    width: 100%;
    height:70;
    float: left;
}
.profile-pic{
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: darkseagreen;
    margin: 10px 10px;
    float: left;
}
.favorite{
    float: right;
    padding: 8px;
    font-size: 20px;
}
.heart{
    color: gray;
}
.heart-o{
    color: red !important;
}
.profile-body{
    padding: 10px;
}
.profile-pic-panel p{
    margin-left: 80px;
}
.name{
    margin: 20px 20px;
    font-size: 20px;
    float: left;
}
.beacon{
    margin: 20px 0px;
    margin-left: 80px;
}
.btn-more{
    width: 100%;
}
.result{
    width: 100%;
    height: 40px;
    color: blue;
}
.result p{
    float: right;
}
</style>

<script>
import FilterSearch from '@/components/search/Filter.vue';
export default {
    name: 'Search',
    components:{
        'filter-search': FilterSearch
    },
    data(){
        return{
            err: null,
            message: null,
            searchName: null,
            doctors:null,
            filterFlag: false,
            filter: null
        }
    },
    mounted(){
        this.getDoctors();
    },
    methods:{
        getDoctors(){
            try{
                this.axios.get('http://34.136.2.190:3000/mr/doctor', {
                    headers: {token: localStorage.getItem('token')},
                    params:{}
                }).then(res=>{
                    if(res.data.length>0){
                        
                        this.doctors= this.setFavorite(res.data);
                    }
                }).catch(e=>{
                    this.err = e;
                })
            }catch(e){
                this.err = e;
            }
        },
        toggleFilter(){
            this.filterFlag = !this.filterFlag;
        },
        setFavorite(data){
            data.forEach((d)=>{
                if(d.favorite==null){
                    d.favorite = false;
                }else{
                    d.favorite = true;
                }
            });
            return data;
        },
        filterCall(filters){
            event.preventDefault();
            this.filter = filters;
            let filter ={};
            if(filters.category){
                let cat = filters.category.filter((c)=>{
                    if(c.selected==true){
                        delete c.category;
                        delete c.selected; 
                        return c.id;
                    }
                });
                let category = [];
                cat.forEach((c)=>{
                    category.push(c.id)    
                })
                filter.category = category;
            }
            
            if(filters.state!==null)
                filter.state = filters.state;
            if(filters.city!==null)
                filter.city = filters.city;
            if(filters.name != null)
                filter.name = filters.name

            try{
                this.axios.get('http://34.136.2.190:3000/mr/doctor',{
                    headers:{ token: localStorage.getItem('token')},
                    params:{filter}

                }).then((res)=>{
                    
                    this.doctors= this.setFavorite(res.data);
                    this.toggleFilter();
                }).catch(e=>{
                    this.err = e;
                })
            }
            catch(e){
                this.err = e;
            }
        },
        favorite(item){
            let operation;
            if(item.favorite==false){
                operation = this.axios.post;    
            }else{
                operation = this.axios.delete;
            }
            
            try{
                operation('http://34.136.2.190:3000/mr/doctor/favorite/'+item.id,{headers: {token: localStorage.getItem('token')}  }, {
                 headers: {token: localStorage.getItem('token')}   
                }).then(res=>{
                    if(res.data.flag==true){
                        item.favorite = !item.favorite;
                        this.message = "Favorite Added";
                    }else{
                        this.err = res.data.message;
                    }         
                }).catch(e=>{
                    this.err = e;
                })
            }
            catch(e){
                this.err= e;
            }
            
        },

        showDoctor(item){
            this.$router.push('/search/'+item.id)
        }
    }
}
</script>