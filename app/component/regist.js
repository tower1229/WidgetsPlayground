define(function(require, exports, module) {
    "use strict";
    const box = require('box');
    const wilddogApp = require('js/wilddog');

    module.exports = {
        template: `<div class="screenLayer">
	<div class="g-center">
        <div class="wrap">
            <div class="row">
                <div class="span-6 center" style="background:#fff">
                    <div class="card card-bordered">
                        <div class="card-body">
                            <div class="h1" style="color:#434343">注册</div>
                            <p class="text-muted">创建您的账号</p>
                            <form class="form" id="validForm">
                                <div class="form-group">
                                    <div class="input-group">
                                        <span class="input-group-addon"><i class="ion">&#xe736;</i></span>
                                        <input type="text" class="form-control" placeholder="用户名" name="username" datatype="s4-16" nullmsg="请填写用户名！">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="input-group">
                                        <span class="input-group-addon"><i class="ion">&#xe7bd;</i></span>
                                        <input type="text" class="form-control" name="email" placeholder="邮箱" datatype="e" errormsg="请输入正确的邮箱!" ignore="ignore">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="input-group">
                                        <span class="input-group-addon"><i class="ion">&#xe6c0;</i></span>
                                        <input type="password" class="form-control" placeholder="密码" name="userpassword" datatype="s4-16" nullmsg="请输入密码">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="input-group">
                                        <span class="input-group-addon"><i class="ion">&#xe6c0;</i></span>
                                        <input type="password" class="form-control" placeholder="密码" recheck="userpassword" datatype="*" nullmsg="请再次输入密码">
                                    </div>
                                </div>
                                <div class="form-group m-t-lg">
                                    <button type="submit" class="btn btn-primary btn-block btn-lg">注册</button>
                                </div>
                            </form>
                        </div>
                        <div class="card-foot">
                            <div class="p">
                                <div class="row">
                                    <div class="span-4">
                                        <div class="btn btn-info btn-block">
                                            <i class="ion">&#xe603;</i> QQ
                                        </div>
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
            registUser: function(eml, psw, cb) {
                let vm = this;
                wilddogApp.auth().createUserWithEmailAndPassword(eml, psw)
                    .then(function(user) {
                        vm.$root.sendEmailVerified();
                        let ref = wilddogApp.sync().ref();
                        ref.child('/users/' + user.uid + '/track').set({
                            "record": "[]"
                        }, function(error) {
                            if (error) {
                                box.msg(error, {
                                    color:'danger'
                                });
                            }else{
                                console.log('新用户同步到野狗云端成功');
                            }
                        });
                        if (typeof cb === 'function') {
                            cb(user);
                        }
                    }).catch(function(error) {
                        vm.$store.commit('callLoading', false);
                        box.msg(error, {
                            color: 'danger'
                        });
                    });
            }
        },
        created: function() {
            let vm = this;

            require.async(['jquery', 'validform'], function($) {
                vm.$nextTick(function() {
                    $('#validForm').Validform({
                        tipSweep: false,
                        beforeSubmit: function(form) {
                            vm.$store.commit('callLoading', true);
                            require.async('jquery', function($) {
                                vm.registUser(form.find('input[name="email"]').val(), form.find('input[name="userpassword"]').val(), function(user) {
                                    vm.$store.dispatch('setUserInfo', Object.assign(user, {
                                        displayName: form.find('input[name="username"]').val()
                                    })).then(function(user) {
                                        vm.$store.commit('callLoading', false);
                                        vm.$router.push('/');
                                    });
                                });
                            });
                            return false;
                        }
                    });
                });
            });
        }
    };
});