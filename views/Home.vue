<template>
  <div class="home">
    <Header @activeNav="activeNav($event)"/>
    <Nav v-bind:nav="nav" @closeNav="activeNav($event)"/>
    <Footer v-bind:active="active" @activeMethos="activeMathod($event)"/>
    <router-view></router-view>

  </div>
</template>

<script>
// @ is an alias to /src
import Header from '@/components/Header.vue';
import Nav from '@/components/Nav.vue';
import Footer from '@/components/Footer.vue';
export default {
  name: 'Home',
  components: {
    Header,
    Nav,
    Footer
  },
  data(){
    return{
      nav: false,      
      active: {
        home: true,
        search: false,
        calender: false,
        notification: false,
        profile: false
      }
    }
  },
  methods:{
    activeNav(val){
      this.nav = val;
    },
    activeMethod(val){
      this.active= val;
    }
  },

  mounted(){
    if(!localStorage.token){
      this.$router.push('/login');
    }
  }
}
</script>
