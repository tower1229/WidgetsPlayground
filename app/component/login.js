define(function(require, exports, module) {
    "use strict";
    const box = require('box');
    const wilddogApp = require('js/wilddog');

    module.exports = {
        template: `<div class="screenLayer">
    <div class="g-center">
        <div class="wrap">
            <div class="row">
                <div class="span-8 center">
                    <div class="loginWrapper bg-primary">
                        <div class="full-row">
                            <div class="span-6" style="background:#fff">
                                <div class="p-lg">
                                    <div class="h1" style="color:#434343">登录</div>
                                    <p class="text-muted">登录您的账号</p>
                                    <form class="form" id="validForm">
                                        <div class="form-group">
                                            <div class="input-group">
                                                <span class="input-group-addon"><i class="ion">&#xe736;</i></span>
                                                <input type="text" class="form-control" name="email" placeholder="邮箱" datatype="e" nullmsg="请输入登录邮箱">
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <div class="input-group">
                                                <span class="input-group-addon"><i class="ion">&#xe6c0;</i></span>
                                                <input type="password" class="form-control" name="pwd" placeholder="密码" datatype="s4-16" nullmsg="请输入密码">
                                            </div>
                                        </div>
                                        <div class="form-group m-t-lg">
                                            <button type="submit" class="btn btn-primary">登录</button>
                                            <div class="btn btn-info" @click="qqSignIn">
                                                <i class="ion">&#xe603;</i> QQ登录
                                            </div>
                                            <span class="r btn btn-link resetPsw">忘记密码？</span>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div class="span-6">
                                <div class="p-lg">
                                    <div class="h1 tc">注册</div>
                                    <p class="m-b-lg">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                    <div class="tc">
                                        <router-link to="/regist"><span class="btn btn-info">马上注册</span></router-link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`,
        methods: {
            signIn: function(eml, psw, cb) {
                let vm = this;
                wilddogApp.auth().signInWithEmailAndPassword(eml, psw)
                    .then(function(user) {
                        if (typeof cb === 'function') {
                            cb(user);
                        }
                    }).catch(function(error) {
                        vm.$store.commit('callLoading', false);
                        box.msg(error, {
                            color: 'danger'
                        });
                    });
            },
            qqSignIn: function() {
                let vm = this;
                let provider = new wilddog.auth.QQAuthProvider();
                wilddogApp.auth().signInWithPopup(provider).then(function(user) {
                    vm.signInDirect();
                }).catch(function(error) {
                    vm.$store.commit('callLoading', false);
                    box.msg(error, {
                        color: 'danger'
                    });
                });
            },
            signInDirect: function() {
                let vm = this;
                vm.$store.commit('callLoading', false);
                box.hide();
                vm.$router.push('/');
            }
        },
        created: function() {
            let vm = this;

            require.async(['jquery', 'validform'], function($) {
                vm.$nextTick(function() {
                    let validIns = $('#validForm').Validform({
                        tipSweep: false,
                        beforeSubmit: function(form) {
                            vm.$store.commit('callLoading', true);
                            vm.signIn(form.find('input[name="email"]').val(), form.find('input[name="pwd"]').val(), function(user) {
                                vm.signInDirect();
                            });
                            return false;
                        }
                    });
                    //忘记密码
                    $('.resetPsw').on('click', function() {
                        var hasEml = validIns.check(false, 'input[name="email"]');
                        let emlVal = $('#validForm').find('input[name="email"]').val();
                        if (hasEml) {
                            wilddogApp.auth().sendPasswordResetEmail(emlVal).then(function() {
                                box.msg('重置密码邮件已发送到 ' + emlVal);
                            });
                        }
                    });
                });
            });
        }
    };
});