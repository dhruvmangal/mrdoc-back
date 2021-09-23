<template>
    <div class="container-fluid login-panel">
        <div class="row">
            <div class="col-md-4 "></div>
            <div class="col-md-4">
                <div class="login-form">
                    <div class="login-header">
                        <div class="login-profile">
                            <div class="circle"></div>
                        </div>
                        
                        <h5>Medical Representative Login</h5>
                    </div>
                    <div class="login-body">
                        <div :class="{'error': error, 'error-div': true}">
                            Username or Password is wrong please try again.
                        </div>
                        <form v-on:submit.prevent="login">
                            <div class="login-item">
                                <label for="username">Username</label>
                                <input type="text" name="username" class="form-control input-form shadow-none" placeholder="Enter your username here" v-model="username"/>
                                <span class="icon"><i class="fa fa-user"></i></span>
                            </div>
                            <div class="login-item">
                                <label for="password">Password</label>
                                
                                <input type="password" name="password" class="form-control input-form shadow-none" placeholder="Enter your password here" v-model="password"/>
                                <span class="icon"><i class="fa fa-lock"></i></span>
                            </div>
                            <div class="login-item">
                                <input type="submit" class="form-control btn btn-success" value="Login"/>
                            </div>
                            <div class="login-break">
                                <div class="line"></div>
                                <div class="text">Or</div>
                                <div class="line"></div>
                            </div>
                        </form>
                        <div class="login-item">
                            <button class="btn form-control btn-forgot">Forgot Password?</button>
                        </div>
                        <div class="login-item">
                            <p>&#169; 2018 1hr Solutions</p>
                        </div>
                    </div>
                </div>
                <div class="contact">
                    <div class="login-item">
                        <div class="line-2"></div>
                        <div class="text-2">Contact Us</div>
                        <div class="line-2"></div>
                    </div>
                    <div class="login-item">
                        
                    </div>
                </div>
            </div>
            <div class="col-md-4"></div>

        </div>
        
    </div>
</template>

<style scoped>
    .login-panel{
        position: fixed;
        width: 100%;
        height: 100%;
        top:0px;
        left:0px;
        z-index:1;
        overflow-y: scroll;
    }
    .login-form{
        background-color: white;
        border-radius: 10px;
        margin-top: 100px;
        padding: 10px;
    }
    .login-body{
        width: auto;
        
    }
    .login-profile{
        display: flex;
        justify-content: center;
        margin: 40px 0px;
    }
    .circle{
        width:100px;
        height: 100px;
        border-radius: 50%;
        background-color: rgba(35,35,35,0.5);
        text-align: center; 
    }
    .icon{
        position: relative;
        top: -35px;
        left: 10px;
        color: gray;
        width: 50px;
    }
    .login-item{
        margin: 15px 0px;
    }
    .login-break{
        margin: 30px 0px;
    }
    .input-form{
        width: 100%;
        outline: none !important;
        border-radius: 0px;
        height: 40px;
        border: 0px;
        border-bottom: 2px solid gray;
        box-shadow: none;
        text-indent: 30px;
        
    }
    .input-form::before{
        border: 2px solid gray;
    }
    .input-form:after{
        border: 2px solid green;
        

    }
    .input-form:focus{
        border-color: green;
        animation-name: input-animation;
        animation-duration: 0.5s;
    }
    @keyframes input-animation{
        0%   {width: 0%; border-color: green;}
        100% {width: 100%; border-color: green;}
    }

    .line{
        float: left;
        height: 2px;
        width:35%;
        background-color: #c0c0c0;
        margin-top: 10px;
    }
    .line-2{
        float: left;
        height: 2px;
        width:30%;
        background-color: #c0c0c0;
        margin-top: 10px;
    }
    .text{
        float: left;
        text-align:center;
        margin: 0px 12%;
    }
    .text-2{
        float: left;
        text-align:center;
        margin: 0px 5%;
    }
    .btn-forgot{
        margin-top: 20px;
        border:1px solid #c3c3c3;
    }
    p{
        text-align: center;
        font-weight: solid;
        margin: 15px 0px;
    }
    .error{
        width: 100%;
        border: 1px solid red;
        padding: 10px;
        text-align: center;
        display: block !important;
    }
    .error-div{
        display: none;
    }
    @media only screen and (max-width: 600px) {
        .login-form{
            width: 100%;
            height: 100%;
            margin: 0px;
            border-radius: 0px;
        }
    }
</style>

<script>
export default {
    name: 'Login',
    data(){
        return{
            username: '',
            password: '',
            loginVar: false,
            error: false
        }
    },
    methods:{
        loginCompute() {
            if(this.username.length> 0 && this.password > 0){
                this.loginVar = true;
            }
        },
        login(){
            event.preventDefault();
            this.axios.post('http://34.136.2.190:3000/mr/auth/login', {
                username: this.username,
                password: this.password
            }).then((res) =>{
                if(res.data.accessToken){
                    localStorage.token = res.data.accessToken;
                    this.$router.push('/dashboard');
                }else{
                    this.error= true;
                }
                
            })
            
        }

    },

    computed:{
        
    },
    watch:{
        
    }
}
</script>