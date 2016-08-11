/*
 * angular-ui-bootstrap
 * http://angular-ui.github.io/bootstrap/

 * Version: 0.13.0 - 2015-05-02
 * License: MIT
 */
angular.module("ui.bootstrap",["ui.bootstrap.tpls","ui.bootstrap.accordion","ui.bootstrap.collapse","ui.bootstrap.modal","ui.bootstrap.tabs"]),angular.module("ui.bootstrap.tpls",["template/accordion/accordion-group.html","template/accordion/accordion.html","template/modal/backdrop.html","template/modal/window.html","template/tabs/tab.html","template/tabs/tabset.html"]),angular.module("ui.bootstrap.accordion",["ui.bootstrap.collapse"]).constant("accordionConfig",{closeOthers:!0}).controller("AccordionController",["$scope","$attrs","accordionConfig",function(e,t,n){this.groups=[],this.closeOthers=function(a){var o=angular.isDefined(t.closeOthers)?e.$eval(t.closeOthers):n.closeOthers;o&&angular.forEach(this.groups,function(e){e!==a&&(e.isOpen=!1)})},this.addGroup=function(e){var t=this;this.groups.push(e),e.$on("$destroy",function(){t.removeGroup(e)})},this.removeGroup=function(e){var t=this.groups.indexOf(e);-1!==t&&this.groups.splice(t,1)}}]).directive("accordion",function(){return{restrict:"EA",controller:"AccordionController",transclude:!0,replace:!1,templateUrl:"template/accordion/accordion.html"}}).directive("accordionGroup",function(){return{require:"^accordion",restrict:"EA",transclude:!0,replace:!0,templateUrl:"template/accordion/accordion-group.html",scope:{heading:"@",isOpen:"=?",isDisabled:"=?"},controller:function(){this.setHeading=function(e){this.heading=e}},link:function(e,t,n,a){a.addGroup(e),e.$watch("isOpen",function(t){t&&a.closeOthers(e)}),e.toggleOpen=function(){e.isDisabled||(e.isOpen=!e.isOpen)}}}}).directive("accordionHeading",function(){return{restrict:"EA",transclude:!0,template:"",replace:!0,require:"^accordionGroup",link:function(e,t,n,a,o){a.setHeading(o(e,angular.noop))}}}).directive("accordionTransclude",function(){return{require:"^accordionGroup",link:function(e,t,n,a){e.$watch(function(){return a[n.accordionTransclude]},function(e){e&&(t.html(""),t.append(e))})}}}),angular.module("ui.bootstrap.collapse",[]).directive("collapse",["$animate",function(e){return{link:function(t,n,a){function o(){n.removeClass("collapse").addClass("collapsing"),e.addClass(n,"in",{to:{height:n[0].scrollHeight+"px"}}).then(r)}function r(){n.removeClass("collapsing"),n.css({height:"auto"})}function i(){n.css({height:n[0].scrollHeight+"px"}).removeClass("collapse").addClass("collapsing"),e.removeClass(n,"in",{to:{height:"0"}}).then(l)}function l(){n.css({height:"0"}),n.removeClass("collapsing"),n.addClass("collapse")}t.$watch(a.collapse,function(e){e?i():o()})}}}]),angular.module("ui.bootstrap.modal",[]).factory("$$stackedMap",function(){return{createNew:function(){var e=[];return{add:function(t,n){e.push({key:t,value:n})},get:function(t){for(var n=0;n<e.length;n++)if(t==e[n].key)return e[n]},keys:function(){for(var t=[],n=0;n<e.length;n++)t.push(e[n].key);return t},top:function(){return e[e.length-1]},remove:function(t){for(var n=-1,a=0;a<e.length;a++)if(t==e[a].key){n=a;break}return e.splice(n,1)[0]},removeTop:function(){return e.splice(e.length-1,1)[0]},length:function(){return e.length}}}}}).directive("modalBackdrop",["$timeout",function(e){function t(t){t.animate=!1,e(function(){t.animate=!0})}return{restrict:"EA",replace:!0,templateUrl:"template/modal/backdrop.html",compile:function(e,n){return e.addClass(n.backdropClass),t}}}]).directive("modalWindow",["$modalStack","$q",function(e,t){return{restrict:"EA",scope:{index:"@",animate:"="},replace:!0,transclude:!0,templateUrl:function(e,t){return t.templateUrl||"template/modal/window.html"},link:function(n,a,o){a.addClass(o.windowClass||""),n.size=o.size,n.close=function(t){var n=e.getTop();n&&n.value.backdrop&&"static"!=n.value.backdrop&&t.target===t.currentTarget&&(t.preventDefault(),t.stopPropagation(),e.dismiss(n.key,"backdrop click"))},n.$isRendered=!0;var r=t.defer();o.$observe("modalRender",function(e){"true"==e&&r.resolve()}),r.promise.then(function(){n.animate=!0;var t=a[0].querySelectorAll("[autofocus]");t.length?t[0].focus():a[0].focus();var o=e.getTop();o&&e.modalRendered(o.key)})}}}]).directive("modalAnimationClass",[function(){return{compile:function(e,t){t.modalAnimation&&e.addClass(t.modalAnimationClass)}}}]).directive("modalTransclude",function(){return{link:function(e,t,n,a,o){o(e.$parent,function(e){t.empty(),t.append(e)})}}}).factory("$modalStack",["$animate","$timeout","$document","$compile","$rootScope","$$stackedMap",function(e,t,n,a,o,r){function i(){for(var e=-1,t=f.keys(),n=0;n<t.length;n++)f.get(t[n]).value.backdrop&&(e=n);return e}function l(e){var t=n.find("body").eq(0),a=f.get(e).value;f.remove(e),s(a.modalDomEl,a.modalScope,function(){t.toggleClass(m,f.length()>0),c()})}function c(){if(u&&-1==i()){var e=p;s(u,p,function(){e=null}),u=void 0,p=void 0}}function s(n,a,r){function i(){i.done||(i.done=!0,n.remove(),a.$destroy(),r&&r())}a.animate=!1,n.attr("modal-animation")&&e.enabled()?n.one("$animate:close",function(){o.$evalAsync(i)}):t(i)}function d(e,t,n){return!e.value.modalScope.$broadcast("modal.closing",t,n).defaultPrevented}var u,p,m="modal-open",f=r.createNew(),v={};return o.$watch(i,function(e){p&&(p.index=e)}),n.bind("keydown",function(e){var t;27===e.which&&(t=f.top(),t&&t.value.keyboard&&(e.preventDefault(),o.$apply(function(){v.dismiss(t.key,"escape key press")})))}),v.open=function(e,t){var r=n[0].activeElement;f.add(e,{deferred:t.deferred,renderDeferred:t.renderDeferred,modalScope:t.scope,backdrop:t.backdrop,keyboard:t.keyboard});var l=n.find("body").eq(0),c=i();if(c>=0&&!u){p=o.$new(!0),p.index=c;var s=angular.element('<div modal-backdrop="modal-backdrop"></div>');s.attr("backdrop-class",t.backdropClass),t.animation&&s.attr("modal-animation","true"),u=a(s)(p),l.append(u)}var d=angular.element('<div modal-window="modal-window"></div>');d.attr({"template-url":t.windowTemplateUrl,"window-class":t.windowClass,size:t.size,index:f.length()-1,animate:"animate"}).html(t.content),t.animation&&d.attr("modal-animation","true");var v=a(d)(t.scope);f.top().value.modalDomEl=v,f.top().value.modalOpener=r,l.append(v),l.addClass(m)},v.close=function(e,t){var n=f.get(e);return n&&d(n,t,!0)?(n.value.deferred.resolve(t),l(e),n.value.modalOpener.focus(),!0):!n},v.dismiss=function(e,t){var n=f.get(e);return n&&d(n,t,!1)?(n.value.deferred.reject(t),l(e),n.value.modalOpener.focus(),!0):!n},v.dismissAll=function(e){for(var t=this.getTop();t&&this.dismiss(t.key,e);)t=this.getTop()},v.getTop=function(){return f.top()},v.modalRendered=function(e){var t=f.get(e);t&&t.value.renderDeferred.resolve()},v}]).provider("$modal",function(){var e={options:{animation:!0,backdrop:!0,keyboard:!0},$get:["$injector","$rootScope","$q","$templateRequest","$controller","$modalStack",function(t,n,a,o,r,i){function l(e){return e.template?a.when(e.template):o(angular.isFunction(e.templateUrl)?e.templateUrl():e.templateUrl)}function c(e){var n=[];return angular.forEach(e,function(e){(angular.isFunction(e)||angular.isArray(e))&&n.push(a.when(t.invoke(e)))}),n}var s={};return s.open=function(t){var o=a.defer(),s=a.defer(),d=a.defer(),u={result:o.promise,opened:s.promise,rendered:d.promise,close:function(e){return i.close(u,e)},dismiss:function(e){return i.dismiss(u,e)}};if(t=angular.extend({},e.options,t),t.resolve=t.resolve||{},!t.template&&!t.templateUrl)throw new Error("One of template or templateUrl options is required.");var p=a.all([l(t)].concat(c(t.resolve)));return p.then(function(e){var a=(t.scope||n).$new();a.$close=u.close,a.$dismiss=u.dismiss;var l,c={},s=1;t.controller&&(c.$scope=a,c.$modalInstance=u,angular.forEach(t.resolve,function(t,n){c[n]=e[s++]}),l=r(t.controller,c),t.controllerAs&&(a[t.controllerAs]=l)),i.open(u,{scope:a,deferred:o,renderDeferred:d,content:e[0],animation:t.animation,backdrop:t.backdrop,keyboard:t.keyboard,backdropClass:t.backdropClass,windowClass:t.windowClass,windowTemplateUrl:t.windowTemplateUrl,size:t.size})},function(e){o.reject(e)}),p.then(function(){s.resolve(!0)},function(e){s.reject(e)}),u},s}]};return e}),angular.module("ui.bootstrap.tabs",[]).controller("TabsetController",["$scope",function(e){var t=this,n=t.tabs=e.tabs=[];t.select=function(e){angular.forEach(n,function(t){t.active&&t!==e&&(t.active=!1,t.onDeselect())}),e.active=!0,e.onSelect()},t.addTab=function(e){n.push(e),1===n.length&&e.active!==!1?e.active=!0:e.active?t.select(e):e.active=!1},t.removeTab=function(e){var o=n.indexOf(e);if(e.active&&n.length>1&&!a){var r=o==n.length-1?o-1:o+1;t.select(n[r])}n.splice(o,1)};var a;e.$on("$destroy",function(){a=!0})}]).directive("tabset",function(){return{restrict:"EA",transclude:!0,replace:!0,scope:{type:"@"},controller:"TabsetController",templateUrl:"template/tabs/tabset.html",link:function(e,t,n){e.vertical=angular.isDefined(n.vertical)?e.$parent.$eval(n.vertical):!1,e.justified=angular.isDefined(n.justified)?e.$parent.$eval(n.justified):!1}}}).directive("tab",["$parse","$log",function(e,t){return{require:"^tabset",restrict:"EA",replace:!0,templateUrl:"template/tabs/tab.html",transclude:!0,scope:{active:"=?",heading:"@",onSelect:"&select",onDeselect:"&deselect"},controller:function(){},compile:function(n,a,o){return function(n,a,r,i){n.$watch("active",function(e){e&&i.select(n)}),n.disabled=!1,r.disable&&n.$parent.$watch(e(r.disable),function(e){n.disabled=!!e}),r.disabled&&(t.warn('Use of "disabled" attribute has been deprecated, please use "disable"'),n.$parent.$watch(e(r.disabled),function(e){n.disabled=!!e})),n.select=function(){n.disabled||(n.active=!0)},i.addTab(n),n.$on("$destroy",function(){i.removeTab(n)}),n.$transcludeFn=o}}}}]).directive("tabHeadingTransclude",[function(){return{restrict:"A",require:"^tab",link:function(e,t){e.$watch("headingElement",function(e){e&&(t.html(""),t.append(e))})}}}]).directive("tabContentTransclude",function(){function e(e){return e.tagName&&(e.hasAttribute("tab-heading")||e.hasAttribute("data-tab-heading")||"tab-heading"===e.tagName.toLowerCase()||"data-tab-heading"===e.tagName.toLowerCase())}return{restrict:"A",require:"^tabset",link:function(t,n,a){var o=t.$eval(a.tabContentTransclude);o.$transcludeFn(o.$parent,function(t){angular.forEach(t,function(t){e(t)?o.headingElement=t:n.append(t)})})}}}),angular.module("template/accordion/accordion-group.html",[]).run(["$templateCache",function(e){e.put("template/accordion/accordion-group.html",'<div class="panel panel-default">\n  <div class="panel-heading">\n    <h4 class="panel-title">\n      <a href="javascript:void(0)" tabindex="0" class="accordion-toggle" ng-click="toggleOpen()" accordion-transclude="heading"><span ng-class="{\'text-muted\': isDisabled}">{{heading}}</span></a>\n    </h4>\n  </div>\n  <div class="panel-collapse collapse" collapse="!isOpen">\n	  <div class="panel-body" ng-transclude></div>\n  </div>\n</div>\n')}]),angular.module("template/accordion/accordion.html",[]).run(["$templateCache",function(e){e.put("template/accordion/accordion.html",'<div class="panel-group" ng-transclude></div>')}]),angular.module("template/modal/backdrop.html",[]).run(["$templateCache",function(e){e.put("template/modal/backdrop.html",'<div class="modal-backdrop"\n     modal-animation-class="fade"\n     ng-class="{in: animate}"\n     ng-style="{\'z-index\': 1040 + (index && 1 || 0) + index*10}"\n></div>\n')}]),angular.module("template/modal/window.html",[]).run(["$templateCache",function(e){e.put("template/modal/window.html",'<div modal-render="{{$isRendered}}" tabindex="-1" role="dialog" class="modal"\n    modal-animation-class="fade"\n	ng-class="{in: animate}" ng-style="{\'z-index\': 1050 + index*10, display: \'block\'}" ng-click="close($event)">\n    <div class="modal-dialog" ng-class="size ? \'modal-\' + size : \'\'"><div class="modal-content" modal-transclude></div></div>\n</div>\n')}]),angular.module("template/tabs/tab.html",[]).run(["$templateCache",function(e){e.put("template/tabs/tab.html",'<li ng-class="{active: active, disabled: disabled}">\n  <a href ng-click="select()" tab-heading-transclude>{{heading}}</a>\n</li>\n')}]),angular.module("template/tabs/tabset.html",[]).run(["$templateCache",function(e){e.put("template/tabs/tabset.html",'<div>\n  <ul class="nav nav-{{type || \'tabs\'}}" ng-class="{\'nav-stacked\': vertical, \'nav-justified\': justified}" ng-transclude></ul>\n  <div class="tab-content">\n    <div class="tab-pane" \n         ng-repeat="tab in tabs" \n         ng-class="{active: tab.active}"\n         tab-content-transclude="tab">\n    </div>\n  </div>\n</div>\n')}]);