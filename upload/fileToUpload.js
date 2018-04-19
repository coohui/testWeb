define(function(require, exports, module) {
    var _jquery_form = require('jquery_form');
    var Vue = require('vue');

    var o = {};
    o.def = {};

    //删除请求
    DSE.uploadConfig.doDeleteFile = function(t, params) {
        var $t = $(t);
        var $tr = $t.parents('.' + o.app.ftr + '[data-randomId="' + params.randomId + '"]');
        var pkId = $tr.attr('data-pkId') || params.newId;
        var _txt = $tr.find('.fileTime').text();
        var _remove = function(data, params) {
            o.app.removeTr($tr);
            o.app.ieSucFun(params.randomId);
            o.app.onDelete(data, params);
        };
        o.app.beforeDelete(params, $tr);
        if (!$tr.attr('data-pkId')) {
            _remove('', params);
        } else {
            var _flag = true;
            if (_flag) {
                _flag = false;
                $.ajax({
                    url: DSE.serverPath + DSE.uploadConfig.fileToUpload_deleteUrl + pkId,
                    type: 'post',
                    dataType: 'json',
                    success: function(data) {
                        if (data["data"]) {
                            _remove(data, params);
                        } else {
                            $tips.msg('删除失败');
                        }
                    },
                    error: function() {
                        console.log('删除请求出错');
                    }
                });
            }
        }
        if (!o.app.autosubmit && o.app.fileData[params.randomId]) {
            delete o.app.fileData[params.randomId];
            delete o.app.paramData[params.randomId];
        }
        if (!o.app.autosubmit && o.app.paramDataIE[params.randomId]) {
            delete o.app.paramDataIE[params.randomId];
        }
    };

    DSE.uploadConfig.iframeUpload = function(t, params) {
        var $t = $(t);
        if (!o.def.multiple) {
            var $tr = $t.parents('.' + o.app.ftr + '[data-randomId="' + params.randomId + '"]');
            o.def.fql.find('.fileDelete').trigger('click');
        }
        if (o.app.isIE) {
            //IE9 以下浏览器
            var randomId = params.randomId,
                fpath = t.value,
                f = fpath.substr(fpath.lastIndexOf("\\")).toLowerCase().substring(1),
                getFile = o.app.getFiles(f);
            params.ftype = getFile.type; //获得文件后缀名
            params.fname = getFile.name; //获得文件名

            if (!o.app.isAccept(params.ftype)) {
                return false;
            }

            o.app.createTr(params, 'IE');

            if (o.app.autosubmit) {
                o.app.doFiles(params, $t.parents('#' + o.app.fifrform));
            }

        } else {
            //其他浏览器
            var files = t.files;
            for (var i = 0; i < files.length; i++) {
                var getFile = o.app.getFiles(files[i].name);
                if (!o.app.isAccept(getFile.type)) {
                    return false;
                }
                params.randomId = $.getId();
                var p = params;
                p.ftype = getFile.type;
                p.fname = getFile.name;
                p.fsize = o.app.fmtSize(files[i].size);

                (function(i) {
                    o.app.createTr(p, i);
                    if (!o.app.autosubmit) {
                        o.app.fileData[params.randomId] = files[i];
                        o.app.paramData[p.randomId] = {
                            rowId: p.rowId,
                            newId: p.newId,
                            btype: p.btype,
                            creator: p.userName,
                            randomId: p.randomId
                        };
                    }
                })(i);

                if (o.app.autosubmit) {
                    o.app.doFiles(params, files[i]);
                }
            }

        }

    };
    DSE.uploadConfig._creatFileForm = function(t) {
        var randomId = $.getId();
        var params = {
            rowId: DSE.pageConfig.rowId,
            newId: o.def.newId,
            btype: o.def.btype,
            creator: DSE.user.userName,
            randomId: randomId
        };
        o.app.paramDataIE[randomId] = params;
        var multiple = o.def.multiple ? ' multiple="true"' : '';
        var act = o.def.accept.split(','),
            act_type = '';
        $.each(act, function(i) {
            if (act[i]) {
                if (i == 0) {
                    act_type += o.app.acceptType[act[i]];
                } else {
                    act_type += ',' + o.app.acceptType[act[i]];
                }
            }
        });
        var p = objToParam(params);
        $(t).contents().find('body').html('<form id="' + o.app.fifrform + '" name="' + o.app.fifrform + '" action="' + DSE.serverPath + DSE.uploadConfig.fileToUpload_actionUrl + '?' + $.param(params) + '" method="post" enctype="multipart/form-data" target="ajaxUpload" data-randomId="' + randomId + '">\
            <input id="file_' + randomId + '" type="file" name="file" class="btn btn-success" onchange="parent.DSE.uploadConfig.iframeUpload(this,' + p + ')"' + multiple + '" accept="' + act_type + '" />\
        </form>');
        $(t).contents().find('#file_' + randomId).click();
    };

    o.app = new Vue({
        data: function() {
            return {
                fifr: 'iframeUpload', //ie9 通过创建 iframe 无刷新提交表单
                isIE: !!!window.FormData,
                fifrform: 'fileForm', //
                fbtn: 'file_btn',
                autosubmit: true, //选择后上传
                subBtn: 'submitBtn', //点击开始上传
                fql: 'queueList', //上传列表 tbody 样式
                ftr: 'file_tr', //上传列表 tr 样式
                ftd: 'td', //上传列表属性框
                fnull: 'f-no-data', //无文件样式
                fnullText: '没有上传的文件', //没有上传文件时显示
                errText: '上传失败', //上传失败显示文字
                acceptType: { 'jpg': 'image/jpeg', 'png': 'image/png', 'gif': 'image/gif', 'tiff': 'image/tiff', 'word': 'application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'excel': 'application/vnd.ms-excel application/x-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'ppt': 'application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation', 'pdf': 'application/pdf', 'swf': 'application/x-shockwave-flash', 'rar': 'application/octet-stream', 'tar': 'application/x-tar', 'tgz': 'application/x-compressed', 'zip': 'application/x-zip-compressed', 'wmv': 'video/x-ms-wmv', 'avi': 'video/x-msvideo', 'rmvb': 'video/vnd.rn-realvideo', 'flv': 'application/octet-stream', 'mp4': 'video/mp4', 'ogv': 'video/ogg', 'webm': 'video/webm', 'wav': 'audio/wav', 'wma': 'audio/x-ms-wma', 'mp3': 'audio/mpeg', 'txt': 'text/plain', 'xml': 'text/xml', 'html': 'text/html', 'css': 'text/css', 'js': 'text/javascript', 'ico': 'image/x-icon' },
                acceptType2: { 'word': 'doc,docx', 'excel': 'xls,xlsx', 'ppt': 'ppt,pptx', 'pdf': 'pdf', 'jpg': 'jpg', 'png': 'png', 'gif': 'gif', 'tiff': 'tiff' },
                accept: 'word,excel,pdf,jpg,png,gif,tiff', //限制上传文件类型
                maxSize: 75, //默认限制大小 75M
                btype: 1, //上传文件类型，默认 1
                proTime: 100, //轮询间隔时间，默认 100 毫秒
                fileData: {}, //存储 files
                paramData: {}, //存储 params
                paramDataIE: {}, //存储 params, ie9 以下
                progress: {},
                oldFileName: '' //重命名时保存原有名称
            };
        },
        methods: {
            newfiles: function(f) {
                var t = this;
                if (!o.def.newId) {
                    o.def.newId = $.getNewId();
                }
                o.def.fb = $(t.$el);
                o.def.fbtn = $(f);
                o.def.multiple = !!!o.def.fbtn.attr('data-single');
                o.def.accept = o.def.fbtn.attr('data-accept') || t.accept;
                o.def.btype = o.def.fbtn.attr('data-btype') || t.btype;
                o.def.findex = $(f).index('.' + t.fbtn);
                o.def.fql = o.def.fb.find('.' + t.fql).eq(o.def.findex);
                o.def.ftr = o.def.fql.find('.' + t.ftr + ':last');
                o.def.ftd = o.def.ftr.find(t.ftd);
                if (t.autosubmit) {
                    o.def.fb.find('.' + t.fifr).remove();
                }
                o.def.fb.append('<iframe class="' + t.fifr + ' f-dn" onload="DSE.uploadConfig._creatFileForm(this)"></iframe>');
            },
            getFiles: function(file) {
                var str = file.split('.');
                var f = {};
                f.type = str[str.length - 1]; //获得文件后缀名
                f.name = file.substring(0, file.length - f.type.length - 1); //获得文件名
                return f;
            },
            isAccept: function(type) {
                var t = this;
                var act = o.def.accept.split(',');
                var flag = false;
                $.each(act, function(i) {
                    if (t.acceptType2[act[i]].indexOf(type) != -1) {
                        flag = true;
                    }
                });
                if (!flag) {
                    $tips.msg('只能上传 ' + o.def.accept + ' 格式的文件');
                    flag = false;
                }
                return flag;
            },
            rtSize: function(fileSize) {
                if (fileSize < 1024) {
                    fileSize = fileSize + 'B';
                } else if (fileSize < 1024 * 1024 && fileSize >= 1024) {
                    fileSize = Number(fileSize / 1024).toFixed(1) + 'KB';
                } else if (fileSize < 1024 * 1024 * 1024 && fileSize >= 1024 * 1024) {
                    fileSize = Number(fileSize / (1024 * 1024)).toFixed(1) + 'MB';
                }
                return fileSize;
            },
            fmtSize: function(size) {
                var t = this;
                if (size > 1024 * 1024 * t.maxSize) {
                    $tips.msg('上传的文件不能大于 ' + t.maxSize + ' M');
                    return false;
                } else {
                    size = t.rtSize(size);
                }
                return size;
            },
            newTr: function(p, i) {
                var t = this;
                var args = arguments.length,
                    fileSize = null;
                if (i || i == 0) {
                    fileSize = t.rtSize(p.FILESIZE * 1024 * 1024);
                }
                p.randomId = args == 2 ? p.RANDOMID : p.randomId;
                p.newId = args == 2 ? p.PKID : p.newId;
                p.fnameVal = args == 2 ? p.FILENAME : p.fname;
                p.fname = args == 2 ? p.FILENAME + p.FILETYPE : p.fname + '.' + p.ftype;
                p.ftime = args == 2 ? p.CREATEDATE : '<div class="fileProgress">\
                    <div class="progress-box">\
                        <div class="progress-bar">\
                            <div class="progress-text">0%</div>\
                        </div>\
                    </div>\
                </div>';
                p.fsize = args == 2 ? fileSize : nullToSpace(p.fsize);
                var params = objToParam(p);
                var _delBtn = '';
                var _downBtn = '';
                if (DSE.pageConfig.operType != 'detail') {
                    _delBtn = '<a class="fileDelete" href="javascript:" onclick="DSE.uploadConfig.doDeleteFile(this,' + params +
                        ')">删除</a>';
                }
                if (DSE.pageConfig.operType && DSE.pageConfig.operType != 'add') {
                    log(DSE.pageConfig.operType);
                    _downBtn = ' <a href="javascript:" class="fileDownload" onclick="javascript:window.open(\'' + DSE.serverPath + DSE.uploadConfig.fileToUpload_downloadUrl + p.newId + '\');">下载</a>';
                }
                var _fileSize = t.isIE ? '' : '<td align="center">\
                    <div class="fileSize">' + p.fsize + '</div>\
                </td>';
                return '<tr class="' + t.ftr + '" data-randomId=' + p.randomId + '>\
                    <td>\
                        <div class="f-dn"><input type="text" class="fileName" value="' + p.fnameVal + '" data-pkid="' + p.newId + '"></div>\
                        <div class="fileName_ori">' + p.fname + '</div>\
                    </td>\
                    ' + _fileSize + '\
                    <td class="fileTime" align="center">\
                        ' + p.ftime + '\
                    </td>\
                    <td align="center">\
                        <div class="fileOper">\
                            ' + _delBtn + _downBtn + '\
                        </div>\
                    </td>\
                </tr>';
            },
            createTr: function(p, i) {
                var t = this;
                var _newTr = t.newTr(p);
                if (o.def.ftd.find('.' + t.fnull)[0] && (i === 0 || i === 'IE') || !o.def.multiple) {
                    o.def.fql.html(_newTr);
                } else {
                    o.def.fql.prepend(_newTr);
                }
                t.autosubmit = !!!o.def.fbtn.attr('data-submit');
            },
            removeTr: function($tr) {
                var t = this;
                var $fql = $tr.parents('.' + t.fql);
                $tr.remove();
                var cols = t.isIE ? '3' : '4';
                if (!$fql.find('.' + t.ftr)[0]) {
                    $fql.html('<tr class="' + t.ftr + '">\
                        <td colspan="' + cols + '">\
                            <div class="' + t.fnull + '">' + t.fnullText + '</div>\
                        </td>\
                    </tr>');
                    if (!t.autosubmit) {
                        t.autosubmit = true;
                    }
                }
            },
            beforeUpload: function(p, $tr) {
                //上传前执行，return false 可以阻止上传
            },
            onSuccess: function(data, $tr) {
                //上传成功执行
                $tr.attr('data-pkId',data.pkId).find('.fileTime').html(data.createDate);
            },
            beforeDelete: function(p, $tr) {
                //删除前执行，return false 可以阻止删除
            },
            onDelete: function(data, p) {
                //删除成功后执行
            },
            doProgress: function(randomId) {
                var t = this;
                var $tr = o.def.fql.find('.' + t.ftr + '[data-randomId="' + randomId + '"]');
                t.progress[randomId] = setInterval(function() {
                    $.ajax({
                        url: DSE.serverPath + DSE.uploadConfig.fileToUpload_progressUrl + randomId,
                        type: "POST",
                        success: function(data) {
                            if (data) {
                                $tr.find('.fileTime').text(data.percent);
                                if (data.percent == '100%') {
                                    clearInterval(t.progress[randomId]);
                                }
                            }
                        },
                        error: function(data) {
                            clearInterval(t.progress[randomId]);
                            return false;
                        }
                    });
                }, t.proTime);
            },
            doFiles: function(p, file) {
                var t = this;
                var $tr = o.def.fql.find('.' + t.ftr + '[data-randomId="' + p.randomId + '"]');
                p.newName = $tr.find('.fileName').val();
                var onError = function() {
                    $tr.find('.fileTime').html(t.errText);
                    clearInterval(t.progress[p.randomId]);
                };
                if (t.fileData[p.randomId] || t.autosubmit || t.isIE) {
                    t.beforeUpload(p, $tr);
                    t.doProgress(p.randomId);
                    if (window.FormData) {
                        var f = new FormData();
                        if (file) {
                            f.append(file.name, file);
                        } else {
                            f.append(t.fileData[p.randomId].name, t.fileData[p.randomId]);
                        }
                        $.ajax({
                            url: DSE.serverPath + DSE.uploadConfig.fileToUpload_actionUrl + '?' + $.param(p),
                            type: "POST",
                            data: f,
                            processData: false, // 告诉jQuery不要去处理发送的数据
                            contentType: false, // 告诉jQuery不要去设置Content-Type请求头
                            success: function(data) {
                                if (typeof data == 'string') {
                                    data = $.parseJSON(data);
                                }
                                if (data.status == 'success') {
                                    t.onSuccess(data, $tr);
                                }else{
                                    onError();
                                    return false;
                                }
                                if (t.fileData[p.randomId]) {
                                    delete t.fileData[p.randomId];
                                }
                            },
                            error: function(data) {
                                onError();
                                return false;
                            }
                        });
                    } else {
                        var act = file.attr('action') + '&newName=' + p.newName;
                        file.attr('action', act).ajaxSubmit({
                            success: function(data) {
                                if (String(data).indexOf('Error:') == -1) {
                                    t.onSuccess(data, $tr);
                                    if (t.paramDataIE[p.randomId]) {
                                        delete t.paramDataIE[p.randomId];
                                    }
                                } else {
                                    onError();
                                }
                                t.ieSucFun(p.randomId);
                            }
                        });
                    };
                }
            },
            ieSucFun: function(randomId) {
                var t = this;
                var ifr = o.def.fb.find('iframe.' + t.fifr);
                $.each(ifr, function(i) {
                    if (ifr.eq(i).contents().find('form[data-randomId="' + randomId + '"]')[0]) {
                        ifr.eq(i).remove();
                    }
                });
            },
            submitfiles: function() {
                var t = this;
                if (!t.autosubmit) {
                    if (!t.isIE) {
                        for (var i in t.paramData) {
                            if (t.paramData.hasOwnProperty(i)) {
                                t.doFiles(t.paramData[i]);
                            }
                        }
                    } else {
                        var ifr = o.def.fb.find('iframe.' + t.fifr);
                        $.each(t.paramDataIE, function(n, v) {
                            var $form = ifr.contents().find('form[data-randomId="' + n + '"]');
                            t.doFiles(v, $form);
                        });
                    }
                }
            },
            getFilesList: function(id) {
                var t = this;
                var data = $ajax({ url: DSE.serverPath + DSE.uploadConfig.fileToUpload_FilesListUrl + id })["data"] || [];
                $.each(data, function(i) {
                    if (data[i]) {
                        var $queueList = $(t.$el).find('.' + t.fql + '[data-btype="' + data[i].btype + '"]');
                        $queueList.append(t.newTr(data[i], i));
                    }
                });
            }
        }
    }).$mount('#fileListTable');

    //双击fileName修改文件名
    $(o.app.$el).on('dblclick', '.fileName_ori', function(e) {
        var $t = $(this);
        $t.hide().siblings().show().find('.fileName').removeAttr('disabled').focus();
    });
    $(o.app.$el).on('focus', '.fileName', function(e) {
        var $t = $(this);
        log($t);
        o.app.oldFileName = $t.val();
    });
    $(o.app.$el).on('blur', '.fileName', function(e) {
        var $t = $(this),
            $v = $t.val(),
            $pkid = $t.attr('data-pkid'),
            $tt = $t.parent().siblings('.fileName_ori'),
            $str = String($tt.text()).split('.');
        $str = $str[$str.length - 1];
        var onError = function() {
            $t.val(o.app.oldFileName);
            $tt.text(o.app.oldFileName + '.' + $str).show().siblings().hide();
        };
        if (o.app.oldFileName != $v && $v != '') {
            $tips.confirm("文件名被修改，确认保存吗?", function(index) {
                //执行保存方法
                $.ajax({
                    url: DSE.serverPath + DSE.uploadConfig.fileToUpload_rename.url + '?' + DSE.uploadConfig.fileToUpload_rename.id + '=' + $pkid + '&' + DSE.uploadConfig.fileToUpload_rename.name + '=' + $v,
                    type: 'post',
                    success: function(data) {
                        $t.val($v);
                        $tt.text($v + '.' + $str).show().siblings().hide();
                    },
                    error: function() {
                        onError();
                    }
                });
            }, function() {
                onError();
            });
        } else {
            $tt.show().siblings().hide();
        }
    });

    return o;
});
