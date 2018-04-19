dseDefine(function(require, exports, module){
  module.exports.input={
     Constant:{
        increasing:160, //tab的z-index关系
     },
     //清除按钮
     Clear:function(input,config){
      var input=$(input);
      var timestamp = $.now()+ Math.round(Math.random()*10000);
      var parent=input.parent();
      var top=input.offset().top-parent.offset().top+1;
      var left=input.offset().left-parent.offset().left+input.outerWidth()-22
      var defaultOption={left:left,top:top,Class:'tab-'+timestamp,offsetTop:0,offsetLeft:0,zIndex:-1};
      var settings= $.extend({},defaultOption,config);
      var div=$('<div class="input-clear" id="'+settings.Class+'"></div>'); 
      this.Constant.increasing=this.Constant.increasing+settings.zIndex;
      if(this.Constant.increasing<0){this.Constant.increasing=0}
      parent.css({position:'relative',zIndex:this.Constant.increasing});

      if(config&&config.html) {div.append(config.html)};
      div.css({position:'absolute',left:settings.left+settings.offsetLeft,top:settings.top+settings.offsetTop,zIndex:this.Constant.increasing});
      parent.append(div);
      input.on('focusout keyup',function(){
          if(input.val()!=''){
              input.siblings('#'+settings.Class).show();
          }else{
              input.siblings('#'+settings.Class).hide();
          }
      });

      $('#'+settings.Class).on('click',function(){
          input.val('');
          $('#'+settings.Class).hide();
          settings.clearClick&&settings.clearClick(settings);
      });

      return settings;
     },
     //焦距边框
     Focus:function(input){
      $(input).on('focusin',function(){
            $(this).addClass('input-in');
      })
      $(input).on('focusout',function(){
            $(this).removeClass('input-in');
      })
     },
     //关键字搜索
     keySearch:function(id,config){
         var defaultOption={btn:false,first:true,height:40,scrollTarget:'body',sign:'red',clear:false};
         var settings= $.extend({},defaultOption,config);
         var _this=this;
         var search=$(settings.trigger);
         var findLabel=$(settings.target).find(settings.className);

         if(settings.clear){
            _clear();
            return false;
         }

         search.unbind('click').on('click',function(){
              var val=$.trim($(id).val());
              settings.first=true;
              _clear();
              for(var i=0;i<findLabel.length;i++){
                 var text=findLabel.eq(i).text();
                 if(text.split(val).length>1){
                     settings.btn=true;
                     text=text.split(val).join('<span class="'+settings.sign+'">'+val+'</span>');
                     findLabel.eq(i).html(text);
                     if(settings.first){
                        $(settings.scrollTarget).scrollTop(findLabel.eq(i).offset().top-settings.height);
                        settings.first=false;
                     }
                 }
              }
              if(!settings.btn){
                settings.callback&&settings.callback();
              }
              settings.onClick&&settings.onClick();
         });
          
         function _clear(){
            var sign=$('.'+settings.sign);
            for(var i=0;i<sign.length;i++){
               var str=sign.eq(i).parent().text();
               sign.eq(i).parent().html(str);
            }
         }

         return settings;
     }
  };
  //模拟选择框
  module.exports.check={
    createCheck:function(obj,config){
       //all:是否需要全选按钮 checkAll:是否全选 （isCheckedKey:'isChecked',isCheckName:'Y' //如果数据中的isChecked==Y则选中该项） least 至少选中几个
       var defaultOption={value:'value',key:'value',keyVal:'',firstKey:'value',name:'name',all:true,least:0,checkAll:false,isCheckedKey:'isChecked',isCheckName:'Y',firstName:'全部',firstVal:'',initHtml:true,initVal:false,initName:true,updata:false};
       var settings= $.extend({},defaultOption,config);
       var data=settings.data;
       var least=(settings.least>0&&data.length>settings.least)?settings.least:0;
       //创建列表
       _createList();
       var checkList=$(obj).find('.checkList');
       var checkbox=$(obj).find('.checkbox');
       var checkItem=$(obj).find('.checkItem');
       var checkAll=$(obj).find('.checkAll');
       //初始化数据
       _initData();
       _checkClick();
       _checkAll();

       function _createList(){ 
          if(!$(obj).data('createList')){
             var str='<ul class="checkList clear"></ul>';
             var list='';
             var allActive='';
             var allChecked='';
             var isCheckAll=true;
             $(obj).html(str);

            isAll();//判断是否全选中

            if(settings.all&&data.length){
              var all='<li class="item-li item-all"><label class="'+allActive+' item-label"><input class="checkAll" '+allChecked+' '+settings.firstKey+'="'+settings.firstVal+'" name="" type="checkbox" /><a class="checktext" title="'+settings.firstName+'">'+settings.firstName+'</a></label></li>';
            }else{
              var all=''; 
            }

            list=all+list;

            $(obj).find('.checkList').html(list);
            $(obj).data('createList',1);

            function isAll(){
              for(var i=0;i<data.length;i++){
                  if(settings.checkAll||data[i][settings.isCheckedKey]==settings.isCheckName){
                     var active='active';
                     var checked='checked';
                  }else{
                     var active='';
                     var checked=data[i][settings.isCheckName]?'checked':'';
                     isCheckAll=false;
                  }
                  list+='<li class="listItem item-li"><label class="checkItem item-label '+active+'"><input type="checkbox" class="checkbox"  index="'+i+'" '+checked+' '+settings.key+'="'+settings.keyVal+'" name="" val="'+data[i][settings.value]+'" /><a class="checktext" title="'+data[i][settings.name]+'">'+data[i][settings.name]+'</a></label></li>';
              }
              if(isCheckAll){
                 allActive='active';
                 allChecked='checked';
              }else{
                 allActive='';
                 allChecked='';
              }
            }
          };
      };
      //选中事件
      function _checkClick(){
          var _this=this;
          if(!$(obj).data('_checkClick')){
              checkbox.unbind('change').on('change',function(){
                    if($(this).is(':checked')){
                       $(this).parent('label').addClass('active'); 
                       settings.onCheck&&settings.onCheck(data,settings);
                    }else{
                       if($(obj).find('.listItem').find('.active').length<=least){
                            $(this).prop("checked",true);
                            return false;
                       }
                       $(this).parent('label').removeClass('active'); 
                       settings.unCheck&&settings.unCheck(data,settings);
                    }
                    isCheckAll();
                    //判断是否选择全部
                    function isCheckAll(){
                          var isCheckAll=true;
                          for(var i=0;i<checkItem.length;i++){
                             if(!checkItem.eq(i).hasClass('active')){
                                isCheckAll=false; 
                                break; 
                             }
                          }
                          if(isCheckAll){//全选
                              checkAll.prop("checked",true);
                              checkAll.parent('label').addClass('active');
                          }else{
                              checkAll.prop("checked",false);
                              checkAll.parent('label').removeClass('active');
                          }
                    }
                    settings.check&&settings.check(data,settings);
              });
              $(obj).data('_checkClick',1);
        }
      };
      //全选事件
      function _checkAll(){
            if(!$(obj).data('_checkAll')){
                checkAll.unbind('change').on('change',function(){
                    if($(this).is(':checked')){
                        $(this).parent('label').addClass('active'); 
                        settings.onCheckAll&&settings.onCheckAll(data,settings);
                        for(var i=0;i<checkbox.length;i++){
                           checkbox.eq(i).prop("checked",true);
                           checkItem.eq(i).addClass('active');
                        }
                    }else{
                        $(this).parent('label').removeClass('active'); 
                        settings.unCheckAll&&settings.unCheckAll(data,settings);
                        for(var i=least;i<checkbox.length;i++){
                           checkbox.eq(i).prop("checked",false);
                           checkItem.eq(i).removeClass('active');
                        }
                    }
                    settings.checkAll&&settings.checkAll(data,settings);
                }); 
                $(obj).data('_checkAll',1);
            } 
      }

      //初始化数据
      function _initData(){
             if(!$(obj).data('initData')){ 
                $(obj).data('initData',1);
            }
      };
    }
  }; 
  //模拟下拉框
  module.exports.select={
    createSelect:function(obj,config){
       //value:key的'value'值,key:'value'的属性,name:列表的展示名,all:是否有全部选项,firstName:列表第一个显示项,firstVal:列表第一个显示值,input:是否用input当选中项,zIndex:追加层级,initindex:初始层级,initHtml:是否要初始化下拉列表,initVal:初始value,initName:初始名,bind:'on',updata:更新数据
       var defaultOption={value:'value',key:'value',name:'name',all:true,firstName:'全部',firstVal:' ',input:'false',zIndex:0,initindex:10000,initHtml:false,initVal:false,initName:false,bind:'on',updata:false};
       var settings= $.extend({},defaultOption,config);
       var data=settings.data;
       var index=0;
       var zIndexInit=settings.initindex-$(obj).position().top;
       var zIndexInitTop=settings.initindex+$(obj).position().top;
       if($(obj).data('already')){//判断是否创建过
           if(settings.updata){
              $(obj).removeData(['createList','initData','selectedClick','LiClick','LiOnmouse']);
           }else{//已经创建过且不更新数据
              return false
           }
       };
       //创建下拉
       _createList();
       var selectIco=$(obj).find('.select-ico');
       var selected=$(obj).find('.selected');
       var selectList=$(obj).find('.select-list');
       var listLi=selectList.find('li');
       var input=$(obj).find('input[type!="hidden"]');
       var hiddenInput=$(obj).find('input[type="hidden"]');
       var inputLen=$(obj).find('.selectInput').length;
       var width=$(obj).outerWidth(true)+12;
       //初始化数据
       _initData();
       //鼠标移入事件
       _liOnmouse();
       //列表点击事件
       _liClick();
       //判断是input框还是div 
       _isInput();
       //点击文档收起下拉框
       _documentClick();
       $(obj).data('already',1);
/*****************内置函数*************************************/
        //创建下拉
        function _createList(){
            if(!$(obj).data('createList')){
               if(settings.all){
                    var list='<li class="active" '+settings.key+'="'+settings.firstVal+'" title="'+settings.firstName+'"><a>'+settings.firstName+'</a></li>';
               }else{
                    var list='';
               }
               
               for(var i=0;i<data.length;i++){
                     list+='<li '+settings.key+'="'+data[i][settings.value]+'"><a title="'+data[i][settings.name]+'">'+data[i][settings.name]+'</a></li>';
               }
               if(settings.initHtml){
                   var str='<div class="selected" '+settings.key+'="">'+settings.firstName+'</div>'+
                           '<ul class="select-list">'+list+'</ul>'+
                           '<div class="select-ico"></div>';
                           $(obj).html(str);
               }else{
                   $(obj).find('.select-list').html(list);
               }
               $(obj).data('createList',1);
             };
        };
        //初始化数据
        function _initData(){
             if(!$(obj).data('initData')){ 
                 if(settings.top)
                  {
                    var height=$(obj).find('.select-list').outerHeight();
                    $(obj).css({'z-index':zIndexInitTop+settings.zIndex});
                    selectList.css({'top':-(height+2),'position':'absolute','border-top':'solid 1px #d4d4d4','border-bottom':'none'});
                  }else{
                    $(obj).css({'z-index':zIndexInit+settings.zIndex});
                  }

                  if(settings.initVal||settings.initName){
                       for(var i=0;i<listLi.length;i++){
                            if(listLi.eq(i).attr(settings.key)===settings.initVal.toString()||listLi.eq(i).find('a').html()===settings.initName.toString()){
                                var val=listLi.eq(i).attr(settings.key);
                                var name=listLi.eq(i).html();
                                var inputName=listLi.eq(i).find('a').html();
                                hiddenInput.val(val);
                                listLi.removeClass('active');
                                listLi.eq(i).addClass('active');
                                if(inputLen>0){
                                  selected.val(inputName);
                                  selected.attr('code',val);
                                }else{
                                  selected.html(name);
                                  selected.attr(settings.key,val);
                                }
                                break;
                            }
                       }
                  }
                  $(obj).data('initData',1);
            }
        };
        //判断是input下拉框还是div下拉框
        function _isInput(){
             if(inputLen>0){
                  _selectedClick2();
             }else{
                  _selectedClick();
             }
        }
        //selected点击事件
        function _selectedClick(){
            if(!$(obj).data('selectedClick')){
                  $(obj).unbind('click').on('click',selectIco,function(){
                        selectList.toggle();
                        selectIco.toggleClass('up');
						            input.toggleClass('up');
                        settings.selectClick&&settings.selectClick(data,settings);
                        return false;                  
                  }); 

                 $(obj).data('selectedClick',1);
           }

        };
        //showSelector:'input'情况
        function _selectedClick2(){
                $(obj).find('.selectInput').unbind('click').on('click',function(){
                    selectList.toggle();
                    $(this).toggleClass('up');

                    settings.selectClick&&settings.selectClick(data,settings);
                    return false;   
                });
        };
        //列表的点击事件
        function _liClick(){
            if(!$(obj).data('LiClick')){
                listLi.unbind('click').on('click',function(){
                    var val=$(this).attr(settings.key)||'';
                    var name=$(this).html();
                    var inputName=$(this).find('a').html();

                    hiddenInput.val(val);
                    selectList.hide();
                    input.toggleClass('up');
                    selectIco.toggleClass('up');
                    listLi.removeClass('active');
                    $(this).addClass('active');
                    if(settings.all){
                        index=$(this).index()-1;
                    }else{
                        index=$(this).index();
                    }  
                    if(inputLen>0){
                       selected.attr('code',val);
                       selected.val(inputName);
                    }else{
                       selected.html(name);
                       selected.attr(settings.key,val);
                    }       
                    settings.onClick&&settings.onClick(data[index],data,settings);
                    return false;
                });
                $(obj).data('LiClick',1);
          }
        };
        //文档点击收回
        function _documentClick(){
            if(!$(obj).data('documentClick')){
                $(document).on('click',function(){
                    selectList.hide(); 
                    selectIco.removeClass('up'); 
                    input.removeClass('up');             
                });
                $(obj).data('documentClick',1);
            }
        };
        //鼠标事件
        function _liOnmouse(){
            if(!$(obj).data('LiOnmouse')){
                selected.unbind('mouseenter').on('mouseenter',function(){
                    $(this).addClass('hover');
                });

                selected.unbind('mouseleave').on('mouseleave',function(){
                    $(this).removeClass('hover');
                });

                selectIco.unbind('mouseenter').on('mouseenter',function(){
                    selected.addClass('hover');
                });

                selectIco.unbind('mouseleave').on('mouseleave',function(){
                    selected.removeClass('hover');
                });

                listLi.unbind('mouseenter').on('mouseenter',function(){
                    listLi.removeClass('active');
                    $(this).addClass('active');
                });
                $(obj).data('LiOnmouse',1);
            }
        };
    },
  };
  //模拟单选
  module.exports.radio={
       normal:function(obj,config){
           var defaultOption={value:'value',name:'name',initHtml:false,initVal:false,initName:false};
           var settings= $.extend({},defaultOption,config);
           var data=settings.data;
           var list='';
           var index=0;
           if(!settings.initHtml){
               for(var i=0;i<data.length;i++){
                    list+='<div value="'+data[i][settings.value]+'" class="radio-item clear">'+data[i][settings.name]+'</div>';
               }
               $(obj).html(list);
           }

           var $item=$(obj).find('.radio-item');
           
           if(settings.initVal||settings.initName)
            {
                 for(var i=0;i<$item.length;i++){
                      if($item.eq(i).attr('value')===settings.initVal.toString()||$item.eq(i).html()===settings.initName.toString()){
                          var val=$item.eq(i).attr('value');
                          var name=$item.eq(i).html();
                          $item.eq(i).addClass('active'); 
                          $(obj).attr({'value':val,'name':name});  
                          break;
                      }
                 }
            }

           $item.on('click',function(){
                 var val=$(this).attr('value');
                 var name=$(this).html();
                 $item.removeClass('active');
                 $(this).addClass('active');
                 $(obj).attr({'value':val,'name':name});
                 index=$(this).index();
                 settings.onClick&&settings.onClick(data[index],data);
           });
         }
  },
  //关键字搜索多选
  module.exports.keysearchPro={
        init:function(id,config){
           var defaultOption={height:28,maxNum:20};
           var settings= $.extend({},defaultOption,config);
           var obj=$(id); 
           _initHtml();//初始化基础框架
           var mulCheck=obj.find('.mulCheck');
           var addInput=obj.find('.add-input');
           var checkSelect=obj.find('.checkSelect');
           var checkSelectList=obj.find('.checkSelectList');
           var addDiv=obj.find('.add-div');
           var checkedItems=obj.find('.checkedItems');
           var checkMore=obj.find('.checkMore');
          
           var objWidth=mulCheck.width();

           _initChecked();
           //_isShowMore();

           function _initHtml(){//初始化基础框架
               var str='<div class="mulCheck">'+
                        '<div class="checkedItems">'+
                          '<div class="add-div">'+
                              '<input class="add-input ignore" size="1" type="text" value="" id="add-input" name="add-input">'+
                          '</div>'+
                        '</div>'+
                        '<div class="checkSelect">'+
                            '<ul class="checkSelectList"></ul>'+
                        '</div>'+
                        '<div class="checkMore">...</div>'+
                    '</div>';
                    obj.html(str);
           }

           function _initChecked(){//初始化选中列表
              var data=settings.data;
              var str='';
              var isMore=0;
              for(var i=0,len=data.length;i<len;i++){
                  str+='<div class="ks-row" unselectable="on" id="row-'+i+'">'+
                        '<div class="ks-item">'+
                             '<span class="mulCheckText" code="'+data[i].code+'">'+data[i].name+'</span>'+
                             '<span class="mulCheckDelete" id="mulCheckDelete'+i+'">x</span>'+
                         '</div>'+
                     '</div>';
                  isMore+=(data[i].name.length*16+23);//假设每个文字16px加上内边距23px，算出选项大概占用宽度
               }
               //如果所有选项的宽度大于最外层宽度减去输入框的默认宽度，则认为有选项没显示全（此方式可能不太准确）
               if(isMore>(objWidth-23)){
                  checkMore.show(); 
               }
               addDiv.before(str);
           }

           function _updateIndex(){//更新索引
               var checkedRows=$('.ks-row');
               for(var i=0,len=checkedRows.length;i<len;i++){
                   checkedRows.eq(i).attr('id','row-'+i);
                   checkedRows.eq(i).find('.mulCheckDelete').attr('id','mulCheckDelete'+i);
               }
           }

           function _getSelData(key){//通过输入的关键字获取查询数据
                $.ajax({
                   type: "get",
                   url:settings.url,
                   crossDomain:true,
                   data: {keyWord:(key||'')},
                   success: function(data){
                      if(data.data){
                        _updateSel(data.data);
                      }
                   }
                });
           }

           function _updateSel(data){//更新下拉框数据列表
              var html='';
              for(var i=0,len=data.length;i<len;i++){
                  html+='<li class="sel-row"><a class="sel-text" id="row'+i+'" code="'+data[i].code+'" title="'+data[i].name+'">'+data[i].name+'</a></li>';
              }
              checkSelectList.html(html);
              checkSelect.show();
           }

           function _updateList(_this){
               var maxWidth=parseInt(objWidth-addInput.position().left);
               var val=_this.val();
               var width=val.length*12;
               width=width>maxWidth?maxWidth:width;
               addInput.css({'width':width});
               _getSelData(val);
           }

           function _isShowMore(){//展开
              var checkedItems=$('.checkedItems');
              if(checkedItems.height()>(settings.height+2)){
                 checkMore.show(); 
              }else{
                 checkMore.hide(); 
              }
           }

           function _isChecked(id){//是否已经选中了
               var mulCheckText=$('.mulCheckText');
               for(var i=0,len=mulCheckText.length;i<len;i++){
                  if(mulCheckText.eq(i).attr('code')==id){
                      return true;
                  }
               }
               return false;
           }

           mulCheck.bind('click').on('click',function(event){
                event=event||window.event;
                var target=event.target||event.srcElement;
                if(target.className=='keysearchPro'||target.className=='mulCheck'||target.className=='checkedItems'){
                   mulCheck.css({'height':'auto'}); 
                   checkSelect.css({'display':'block'});
                   checkedItems.append(addDiv);
                   addInput.focus();
                }else if(target.className=='checkMore'){
                   mulCheck.css({'height':'auto'}); 
                   checkSelect.hide();
                }else if(target.className=='ks-row'){
                  if(target.id){
                      $('#'+target.id).before(addDiv);
                      addInput.focus();
                      _updateIndex();
                  }
                }else if(target.className=='mulCheckText'){
                   console.log('此处可扩展单击编辑item');
                }else if(target.className=='mulCheckDelete'){
                   var deleteId=target.id;
                   $('#'+deleteId).parents('.ks-row').remove();
                   _updateIndex();
                }
                _isShowMore();
                return false;
           }) 
           
           //addInput.keydown(function(event) {}); 

           addInput.keyup(function(event) {
                _updateList($(this));
           }); 

           addInput.focusin(function(){
                _updateList($(this));
           });

           checkSelectList.unbind('click').on('click',function(event){
              event=event||window.event;
              var target=event.target||event.srcElement;
              if(!target.id){return};
              var rowId=$('#'+target.id);
              var name=rowId.html();
              var code=rowId.attr('code');
              var len=$('.ks-row').length;
              var isRepeat=_isChecked(code);
              if(len>=settings.maxNum){
                settings.maxNumFn&&settings.maxNumFn(settings.maxNum);
                return;
              }

              if(isRepeat){
                return;
              };
              var html='<div class="ks-row" id="row-'+len+'" unselectable="on">'+
                    '<div class="ks-item"><span class="mulCheckText" code="'+code+'">'+name+'</span>'+
                    '<span class="mulCheckDelete" id="mulCheckDelete'+len+'">x</span></div>'+
                 '</div>';
                 addDiv.before(html);
                 _updateIndex();
                _isShowMore();
           })

           $(document).keydown(function(event){//回退键删除
              if(event.keyCode==8&&addInput.val()==''){
                 var len=$('.ks-row').length;
                 if(len>0&&$('.ks-row').eq(len-1).hasClass('active')){
                    $('.ks-row').eq(len-1).remove();
                 }else{
                    $('.ks-row').eq(len-1).addClass('active');
                 }
              }
           });

           $(document).unbind('click').on('click',function(){
              $('.ks-row').removeClass('active');
              checkSelect.hide();
              mulCheck.css({'height':settings.height});
           })
        }
  }
  //增加删除一行功能
  module.exports.btn={
        addDelete:function(id,config){
          var defaultOption={row:'row',rowHtml:'tr',feild:{},pushArr:[],sortNum:'sortNum',removelast:false,appendTo:'last',resetId:true};
          var settings= $.extend({},defaultOption,config); 
          var firstRow=$(id).find('.'+settings.row).first();
          $('body').data('html'+id,firstRow.html());

          if(!$(id).data('add')){//增加
               $(id).on('click','.addBtn',function(){
                  if(settings.appendTo=='last'){
                    var index=$(id).find('.'+settings.row).length-1;
                  }else{
                    var index=$(this).parents('.'+settings.row).index();
                  }
                  $(id).find('.'+settings.row).eq(index).after('<'+settings.rowHtml+' class="'+settings.row+'">'+$('body').data('html'+id)+'</'+settings.rowHtml+'>');
                  var last=$(id).find('.'+settings.row).eq(index+1);
                  for(var i=0;i<last.find('input').length;i++){
                    last.find('input').eq(i).val('');
                  }
                  var json=$.extend({},settings.feild);
                  settings.pushArr.push(json);
                  $(id).find('.minusBtn').removeClass('unClick');
                  _resort();
                  settings.onClick&&settings.onClick($(this),id,settings);
                  settings.addClick&&settings.addClick($(this),id,settings);
               });
            $(id).data('add',1);
          };

          if(!$(id).data('delete')){//删除
               $(id).on('click','.minusBtn',function(){
                    if($(id).find('.'+settings.row).length>1){
                        if(settings.removelast){
                          $(id).find('.'+settings.row).last().remove(); 
                        }else{
                          $(this).parents(settings.rowHtml).remove();
                        }
                        settings.pushArr.pop();
                        _resort();
                        if($(id).find('.'+settings.row).length<=1){
                          $(id).find('.minusBtn').addClass('unClick');
                        }
                        settings.onClick&&settings.onClick($(this),id,settings);
                        settings.deleteClick&&settings.deleteClick($(this),id,settings);
                    }
               }); 
            $(id).data('delete',1);
          }
          function _resort(){//重新排序
              var sortNum=$(id).find('.'+settings.sortNum);
              var rows=$(id).find('.'+settings.row);

              for(var i=0;i<rows.length;i++){
                 sortNum.eq(i).html(i+1);
                 settings.resort&&settings.resort(i,rows.eq(i),sortNum.eq(i));
                 if(settings.resetId){
                    var len=rows.eq(i).find('input').length;
                    for(var j=0;j<len;j++){
                      var name=rows.eq(i).find('input').eq(j).attr('name');
                      rows.eq(i).find('input').eq(j).attr('id',name+i);
                    }
                 }
              }
          } 
        }  
  },
  module.exports.tools={
        browserType:function(id,config){
            var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
            var isOpera = userAgent.indexOf("Opera") > -1;
            if (isOpera) {//判断是否Opera浏览器
                return "Opera"
            }else if (userAgent.indexOf("Firefox") > -1) {//判断是否Firefox浏览器
                return "FF";
            }else if (userAgent.indexOf("Chrome") > -1){
                return "Chrome";
            }else if (userAgent.indexOf("Safari") > -1) {//判断是否Safari浏览器
                return "Safari";
            }else if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) { //判断是否IE浏览器
                return "IE";
            };
        },
        //滚动条控制固定列和表头的表格滚动
        frozenTable:function(id,config){
          var defaultOption={scrollElem:'table'};
          var settings= $.extend({},defaultOption,config);
          $(id).scroll(function(event) {
              var left=$(id).scrollLeft();
              var top=$(id).scrollTop();
              var width=$(id).find(settings.scrollElem).width();
              
              $(settings.frozenT).scrollLeft(left);
              $(settings.frozenB).scrollTop(top);
          });

        },
        tableTips:function(id,config){
          var defaultOption={tipsElem:'.markRed'};
          var settings= $.extend({},defaultOption,config);
          $(id).find(settings.tipsElem).mouseenter(function(event) {
               settings.onMouse&&settings.onMouse($(this));
          });
        },
    		//自适应表格高度
    		autoDatagridHeight:function(id,config){
    			var defaultOption={resultTable:'.result-table',datagridView:'.datagrid-view',rowHeight:40,minRows:10,extraHeight:78,pageHeight:50,headerHeight:0};
    			var settings= $.extend({},defaultOption,config);
    			var rows=config.rows;
    			var tableHeight=rows*settings.rowHeight+settings.extraHeight;
    			$(id).css({height:tableHeight});
    			$(id).find(settings.datagridView).height(tableHeight-settings.pageHeight);
    			$(id).find(settings.resultTable).height(tableHeight);
    		},
    		//获取表格在屏幕中可显示的行
    		getRows:function(id,config){
    			var defaultOption={Height:50,rowHeight:40,resultTable:'.result-table',datagridView:'.datagrid-view',minrows:10};
    			var settings= $.extend({},defaultOption,config);
    			var windowsHeight=$(window).height();
    			var tableHeight=(windowsHeight-$(id).offset().top);
    			var rows= (tableHeight-settings.Height)/settings.rowHeight;
    			var rows=parseInt(rows);
    			rows=rows<settings.minrows?settings.minrows:rows;
    			return rows;
    		},
    		//自适应高度
    		getAutoHeight:function(id,config){
    			var defaultOption={heigth:0};
    			var settings= $.extend({},defaultOption,config);
    			var windowsHeight=$(window).height();
    			var autoHeight=(windowsHeight-$(id).offset().top-settings.heigth);
    			$(id).css({height:autoHeight});
    			return autoHeight;
    		},
        //自适应表格宽度
        autoTableWidth:function(id,config){
          var defaultOption={wCut:2,hCut:1,html:'td',editors:'input'};
          var settings= $.extend({},defaultOption,config);
          var div=$(id).find(settings.html);
          for(var i=0;i<div.length;i++){
            var width=div.eq(i).width()-settings.wCut;
            div.eq(i).find(settings.editors).css({'width':width});
          }
        },
        //经纬度转换成秒
        convertMiao:function(num,config){
            var defaultOption={};
            var settings= $.extend({},defaultOption,config);
            var data={};
            num=Number(num)?Number(num):0;
            var arr=String(num).split('.');
            var temp=arr.length>1?arr[arr.length-1]:0;
            data.du=parseFloat(parseFloat(arr[0]).toFixed(10));
            temp='0.'+temp;
            temp=(temp*60);
            arr=String(temp).split('.');
            data.fen=parseFloat(parseFloat(arr[0]).toFixed(10));
            temp=arr.length>1?arr[arr.length-1]:0;
            temp='0.'+temp;
            temp=(temp*60);
            arr=String(temp).split('.');
            data.miao=parseFloat(parseFloat(arr[0]).toFixed(10));
            settings.data=data;
            return settings;
        },
        //转换数字类型
        convertNum:function(num,config){
            var defaultOption={};
            var settings= $.extend({},defaultOption,config);
            var data={};
            num=Number(num)?Number(num):0;
            num=parseFloat(parseFloat(num).toFixed(10));
            return num;
        },
        //替换null
        replaceNull:function(string,config){
            var defaultOption={inf:''};
            var settings= $.extend({},defaultOption,config);
            if(string=='null'||string=='undefined'||!string){
                  return settings.inf;
            }else{
                  return string;
            }
        },
        //去除null
        removeNull:function(data,config){
          for(var i=0;i<data.length;i++){
              for(key in data[i]){
                  if((data[i][key]==null||data[i][key]=='null')&&data[i][key]!=0){
                       data[i][key]='';
                  }
              }
          }
          return data;
        },
        getUrl:function(url,config){
            var defaultOption={url:decodeURI(url=url?url:window.location.href, 'utf-8')};
            var settings= $.extend({},defaultOption,config);
            var str = settings.url;
              if (!_.isString(str) || str.indexOf('?') === -1) return {};
              str = str.split('?')[1].split('&');
              var obj = {};
              str.forEach(function (key) {
                key = key.split('=');
                obj[key[0]] = key[1];
              });
              return obj;
        },
        //对象里面对应的key值复给一个数组
        getArrKey:function(arr,obj,config){
            var defaultOption={'key':'field','value':'title'};
            var settings= $.extend({},defaultOption,config);
            for(var i=0;i<arr.length;i++){
              if(obj[arr[i][settings.key]]){
                 arr[i][settings.value]=obj[arr[i][settings.key]]; 
              }   
            }
            return arr;
        },
        timeSectionVerify:function(valMin,valMax){//验证大小
            if(!valMax) return true;//如果不是时间区间直接则不比较
            var valMin=parseInt(valMin.replace(/[^0-9]+/g,''));
            var valMax=parseInt(valMax.replace(/[^0-9]+/g,''));
            if(valMax>=valMin){//结束时间大于开始时间
                  return true;
            }else{
                  return false;
            };
        },
        toDouble:function(num){//小于10位补0
          var num=parseInt(num);
          if(num){
            num=num<10?('0'+num):num;
          }
          return num;
        },
        add:function(arr,config){//累计相加
           var defaultOption={};
           var settings= $.extend({},defaultOption,config);
           var total=0; 
           for(var i=0;i<arr.length;i++){
               if(arr[i]==''||arr[i]=='null'||arr[i]==null||arr[i]=='undefine'){arr[i]=0};
                 total+=parseFloat(parseFloat(arr[i]).toFixed(10));
           }
           return parseFloat(total.toFixed(10));
        },
        mul:function(arr,config){//累计相乘
           var defaultOption={};
           var settings= $.extend({},defaultOption,config);
           var total=parseFloat(arr[0])?parseFloat(arr[0]):0; 
           for(var i=1;i<arr.length;i++){
                 if(arr[i]==''||arr[i]=='null'||arr[i]=='undefine'){arr[i]=0};
                 total*=parseFloat(parseFloat(arr[i]).toFixed(10))?parseFloat(parseFloat(arr[i]).toFixed(10)):0;
           };
           return parseFloat(total.toFixed(10));
        },
        div:function(a,b,config){//除法
           var defaultOption={};
           var settings= $.extend({},defaultOption,config);
           if(!Number(a)||!Number(b)){return 0;}
           var a=parseFloat(parseFloat(a).toFixed(10));
           var b=parseFloat(parseFloat(b).toFixed(10));
           var total=a/(b?b:1); 
           total=parseFloat(parseFloat(total).toFixed(10));
           return total.toFixed(10);
        }
   };
   //easyUi扩展
   module.exports.easyUi={ 
      autoMergeCells:function(){//合并行
      $.extend($.fn.datagrid.methods, {
            autoMergeCells:function(jq, fields) {
               return jq.each(function() {
                        var target = $(this);
                        if (!fields) {
                            fields = target.datagrid("getColumnFields");
                        }
                        var rows = target.datagrid("getRows");
                        var i = 0,
                        j = 0,
                        temp = {};
                        for (i; i < rows.length; i++) {
                            var row = rows[i];
                            j = 0;
                            for (j; j < fields.length; j++) {
                                var field = fields[j];
                                var tf = temp[field];
                                if (!tf) {
                                    tf = temp[field] = {};
                                    tf[row[field]] = [i];
                                } else {
                                    var tfv = tf[row[field]];
                                    if (tfv) {
                                        tfv.push(i);
                                    } else {
                                        tfv = tf[row[field]] = [i];
                                    }
                                }
                            }
                        }
                        $.each(temp,
                        function(field, colunm) {
                            $.each(colunm,
                            function() {
                                var group = this;

                                if (group.length > 1) {
                                    var before, after, megerIndex = group[0];
                                    for (var i = 0; i < group.length; i++) {
                                        before = group[i];
                                        after = group[i + 1];
                                        if (after && (after - before) == 1) {
                                            continue;
                                        }
                                        var rowspan = before - megerIndex + 1;
                                        if (rowspan > 1) {
                                            target.datagrid('mergeCells', {
                                                index: megerIndex,
                                                field: field,
                                                rowspan: rowspan
                                            });
                                        }
                                        if (after && (after - before) != 1) {
                                            megerIndex = after;
                                        }
                                    }
                                }
                            });
                        });
                    });
            }
          });
      },
      datagridTips:function (obj, len, omit) {//列表页溢出显示
          var $tips = function ($t, $text) {
              len ? $t.addClass('f-wwb') : $t.addClass('f-toe');
              $t.attr('title', $text).tooltip({
                  position: 'right',
                  trackMouse: true,
                  onShow: function () {
                      $t.tooltip('tip').css({
                          borderColor: 'orange',
                          boxShadow: '1px 1px 3px #999'
                      });
                  }
              });
          };
          $(obj).show(function () {
              var $t = $(this),
                      $text = String($t.text()),
                      $tipsFun = function (len) {
                          var $slen = len * 2,
                                  $olen = $text.getBytes();
                          if ($slen < $olen) {
                              var a = 0,
                                      str_cut = new String();
                              for (var i = 0; i < $slen; i++) {
                                  var c = $text.charAt(i);
                                  a++;
                                  if (escape(c).length > 4) {
                                      a++;//中文字符的长度经编码之后大于4
                                  }
                                  str_cut = str_cut.concat(c);
                                  //判断是否超出限制字数
                                  if ($slen <= a) {
                                      $tips($t, $text);
                                      omit ? $text = str_cut : $text = str_cut.substring(0, str_cut.length - 1).concat("...");
                                      $t.text($text);
                                      return false;
                                  }
                              }
                          }
                      };
              //判断是否有子标签
              if ($(obj).find('h1,h2,h3,h4,h5,h6,a,div,span,p,b,i,label,em,strong').length == 0 && len) {
                  $tipsFun(len);
              } else {
                  var $sWidth = $t[0].scrollWidth,
                          $oWidth = $t[0].offsetWidth;
                  //判断文本是否溢出
                  if ($sWidth != $oWidth) {
                      $tips($t, $text);
                  } else {
                      if (len) {
                          $tipsFun(len);
                      }
                  }
              }
          });
      }
  };
  //时间插件扩展
  module.exports.dateExtent=function(id,config){
      var defaultOption={};
      var settings= $.extend({},defaultOption,config);
      $(id).mouseleave(function(){
          $('iframe').closest('div').hide();
          $('iframe').closest('div').mouseleave(function(){
              $(this).hide();
          });
          $('iframe').closest('div').mouseenter(function(){
              $(this).show();
          });
      });
  };
  //滚动条
  module.exports.Scroll=function(id,config){
      var nicescroll=require('nicescroll');
      var defaultOption={attr:{'data-scroll':true,'data-cursor-touch':false},horizrailenabled:true};
      var settings= $.extend({},defaultOption,config);
      $(id).attr(settings.attr);
      $('*[data-scroll="true"]').each(function(){
          var $color = $(this).attr('data-cursor-color') || '#ccc', //滚动条颜色
              $opacity = $(this).attr('data-cursor-opacity') || 0.8, //滚动条颜色不透明度，范围从1到0
              $touch =  false, //是否启用touch事件拖动滚动，默认false
              $width = $(this).attr('data-cursor-width') || '5px',//滚动条宽度
              $border = $(this).attr('data-cursor-border') || '0',//滚动条边框
              $radius = $(this).attr('data-cursor-radius') || '2px',//滚动条圆角
              $autohide = Boolean($(this).attr('data-cursor-autohide')) || true;//是否隐藏滚动条
          $(this).niceScroll({
              cursorcolor: $color,
              cursoropacitymax: $opacity,
              touchbehavior: $touch,
              cursorwidth: $width,
              cursorborder: $border,
              cursorborderradius: $radius,
              autohidemode: $autohide,
              horizrailenabled:settings.horizrailenabled
          });
      });
  };
  //点击展开
  module.exports.slide=function(id,config){
      $(id).find('.cont-click').on('click',function(){
            var _this = this;
            $(id).find('.cont-content').eq($(this).index()/2).slideToggle(function(){
               $(_this).toggleClass('cont-click-down');
            });
      })
  },
  //选项卡
  module.exports.tab = function(tabOption)
  {
      var defaultOption={checkTag:"li",activeClass:"active",dataAttr:"data"};
      var settings= $.extend({},defaultOption,tabOption);
      var data={};

      var $Li=$("#"+settings.navID).find(settings.checkTag);
      var $Content=null;
      settings.contentClass&&($Content=$("."+settings.contentClass));
      $Li.click(function(){
          $Li.removeClass(settings.activeClass);
          $(this).addClass(settings.activeClass);
          data.index=$(this).index();
          //data.this=$(this);
          data[settings.dataAttr]=$(this).attr(settings.dataAttr);
          settings.contentClass&&$Content.hide();
          settings.contentClass&&$Content.eq($(this).index()).show();
          settings.clickCallback&&settings.clickCallback(data);
      });
      settings.callback&&settings.callback();
  };

    var mul = function(a, b) {
        var c = 0,
            d = a.toString(),
            e = b.toString();
        try {
            c += d.split(".")[1].length;
        } catch (f) {}
        try {
            c += e.split(".")[1].length;
        } catch (f) {}
        return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
    };

    var add = function(a, b) {
        var c, d, e;
        try {
            c = a.toString().split(".")[1].length;
        } catch (f) {
            c = 0;
        }
        try {
            d = b.toString().split(".")[1].length;
        } catch (f) {
            d = 0;
        }
        return e = Math.pow(10, Math.max(c, d)), (mul(a, e) + mul(b, e)) / e;
    }

    var sub = function(a, b) {
        var c, d, e;
        try {
            c = a.toString().split(".")[1].length;
        } catch (f) {
            c = 0;
        }
        try {
            d = b.toString().split(".")[1].length;
        } catch (f) {
            d = 0;
        }
        return e = Math.pow(10, Math.max(c, d)), (mul(a, e) - mul(b, e)) / e;
    };


    var div = function(a, b) {
        var c, d, e = 0,
            f = 0;
        try {
            e = a.toString().split(".")[1].length;
        } catch (g) {}
        try {
            f = b.toString().split(".")[1].length;
        } catch (g) {}
        return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), mul(c / d, Math.pow(10, f - e));
    };
//浮点数相加
  module.exports.addNum  = add; 
//浮点数相减
  module.exports.delNum  = sub;
//浮点数相乘
  module.exports.mulNum  = mul;
//浮点数相除
  module.exports.divNum  = div;
});