var app=angular.module("autohack",["ngRoute","ngTouch","ngSanitize","mgcrea.ngStrap"]).config(["$routeProvider","$locationProvider",function(a,b){"use strict";b.hashPrefix("!"),a.when("/dashboard",{templateUrl:"views/dashboard.html",controller:"DashboardCtrl",reloadOnSearch:!0}).when("/quiz",{templateUrl:"views/question.html",controller:"QuizCtrl",reloadOnSearch:!0}).when("/toate-intrebarile",{templateUrl:"views/list.html",controller:"ListQuestionsCtrl",reloadOnSearch:!0}).when("/intrebare",{templateUrl:"views/question.html",controller:"QuestionCtrl",reloadOnSearch:!0}).when("/legislatie-rutiera",{templateUrl:"views/legis.html",controller:"LegisCtrl",reloadOnSearch:!1}).otherwise({redirectTo:"/dashboard"})}]);app.run(["$rootScope",function(a){"use strict";var b=a.root={};b.smallScreen=screen.width<=1024,b.getRandomInt=function(a,b){return Math.floor(Math.random()*(b-a+1))+a},b.findObjectsInArray=function(a,b,c){var d,e=!1;for(d=0;d<a.length;d++)if(a[d].id===b.id){e=!0;break}return c?d:e},b.findObjectById=function(a,b){var c;return angular.forEach(a,function(a){a.id===parseInt(b)&&(c=a)}),c},b.findNextId=function(a,b){for(var c=null,d=0;d<a.length;d++)if(a[d].id===b){c=a[d+1].id;break}return c},b.findPrevId=function(a,b){for(var c=null,d=0;d<a.length;d++)if(a[d].id===b){c=a[d-1].id;break}return c},b.markQuestion=function(a){var b=a.tags,c=b.indexOf("mark");0>c?b.push("mark"):b.splice(c,1)}}]),app.filter("tagged",function(){return function(a,b){var c=[];return a=a||"",b=b||"","object"!=typeof b&&(b=b.replace(/\+/g,",").replace(/_/g," ").split(",")),angular.forEach(b,function(b){angular.forEach(a,function(a){a.tags&&a.tags.indexOf(b)>=0&&c.push(a)})}),c}}),app.controller("TopCtrl",["$rootScope","$scope","$routeParams","$location","$timeout","$q","data","taggedFilter",function(a,b,c,d,e,f,g,h){"use strict";var i=b.top={},j=b.model={};window.localStorage;j.user=g.model.user,g.GetUser().then(function(){}),i.shownSubmenu="",b.Reset=function(){g.RemoveQuestions(),d.path(d.path())},i.ToggleSubmenu=function(a){return a===i.shownSubmenu?(i.shownSubmenu="",i.shownSubmenu):void(i.shownSubmenu=a)}}]),app.controller("DashboardCtrl",["$rootScope","$scope","$routeParams","$location","$timeout","$q","data","taggedFilter",function(a,b,c,d,e,f,g,h){"use strict";var i=b.model={};i.questions=g.model.questions,g.GetQuestions().then(function(a){i.a={corect:h(i.questions.a,"corect").length,incorect:h(i.questions.a,"incorect").length,total:i.questions.a.length},i.b={corect:h(i.questions.b,"corect").length,incorect:h(i.questions.b,"incorect").length,total:i.questions.b.length},i.c={corect:h(i.questions.c,"corect").length,incorect:h(i.questions.c,"incorect").length,total:i.questions.c.length},i.d={corect:h(i.questions.d,"corect").length,incorect:h(i.questions.d,"incorect").length,total:i.questions.d.length}})}]),app.controller("QuizCtrl",["$rootScope","$scope","$routeParams","$location","$timeout","$interval","$q","data","taggedFilter",function(a,b,c,d,e,f,g,h,i){"use strict";var j=b.model={},k=(window.localStorage,window.ga),l=a.root,m=window.moment;j.questions=h.model.questions,j.user=h.model.user,j.category=c.cat,j.category||d.path("/dashboard"),h.GetUser().then(function(){});var n={a:{min:17,max:20},b:{min:22,max:26},c:{min:9,max:11},d:{min:22,max:26}};j.answers={a:!1,b:!1,c:!1},j.statistics={total:n[j.category].max,left:n[j.category].max-1},j.quizmode=0===d.path().indexOf("/quiz")?!0:!1,j.quiz=[],j.current=0,j.starred=!1,j.timer={minutes:30,seconds:0};var o=function(){var a=(new Date).getTime(),b=new Date(a+18e5),c=f(function(){a=(new Date).getTime();var d=m(b-a).seconds(),e=m(b-a).minutes();0===e&&0===d&&(j.splash=!0,f.cancel(c),c=void 0),j.timer={minutes:e,seconds:d}},1e3)};b.StartQuiz=function(){for(var a,b,c,d,e=1;j.quiz.length<=n[j.category].max-1;)a=l.getRandomInt(0,j.questions[j.category].length-1),a=parseInt(a,10),b=j.questions[j.category][a],c=b.tags.indexOf("corect"),d=b.tags.indexOf("incorect"),0>c&&0>d&&(b.tempId=e,j.quiz.push(b),e+=1);j.question=j.quiz[0],o()},h.GetQuestions().then(function(){j.category&&b.StartQuiz()}),b.SetAnswer=function(a){j.alert=!1,j.answers[a]=!j.answers[a]},b.ValidateAnswer=function(){var a=j.question.v.split(" "),c=[];angular.forEach(j.answers,function(a,b){a&&c.push(b)}),j.valid=angular.equals(c.sort(),a.sort()),j.valid?(j.question.tags.push("corect"),j.quizValid=!0):(j.question.tags.push("incorect"),j.quizValid=!1);var d={hitType:"event",eventCategory:"Quiz",eventAction:"click",eventLabel:"validate answer",eventValue:j.question.id};k("send",d),b.NextQuestionInQuiz(),h.SaveQuestions()},b.NextQuestionInQuiz=function(){var a=0;if(angular.forEach(j.quiz,function(b,c){b.id===j.question.id&&(a=c)}),a+1<j.quiz.length){for(var c=a+1;c<j.quiz.length;c++)if(j.quiz[c].tags.indexOf("corect")<0&&j.quiz[c].tags.indexOf("incorect")<0){j.question=j.quiz[c];break}}else j.splash=!0;h.SaveQuestions(),b.ResetAnsweres(),j.statistics.corect=i(j.quiz,"corect"),j.statistics.incorect=i(j.quiz,"incorect"),j.statistics.left=j.statistics.total-(j.statistics.corect.length+j.statistics.incorect.length),j.statistics.incorect.length>n[j.category].max-n[j.category].min&&(j.splash=!0)},b.ResetAnsweres=function(){j.answers.a=!1,j.answers.b=!1,j.answers.c=!1},b.AnswerLater=function(){var a=0;angular.forEach(j.quiz,function(b,c){b.id===j.question.id&&(a=c)}),b.ResetAnsweres();for(var c=a+1;c<j.quiz.length;c++)if(0===j.quiz[c].tags.length){j.question=j.quiz[c];break}var d=j.quiz.splice(a,1);j.quiz.push(d[0])},b.MarkQuestion=function(){l.markQuestion(j.question)},b.popover={title:"Salveaza intrebarea",content:'In meniul din stanga, click pe "Categoria '+j.category.toUpperCase()+' -> Toate intrebarile"'},b.NewQuiz=function(){window.location.reload()}}]),app.controller("QuestionCtrl",["$rootScope","$scope","$routeParams","$location","$timeout","$interval","$q","data","taggedFilter",function(a,b,c,d,e,f,g,h,i){"use strict";var j=b.model={},k=(window.localStorage,c.cat),l=(c.id,a.root);j.quizmode=0===d.path().indexOf("/quiz")?!0:!1,j.answers={a:!1,b:!1,c:!1},j.questionsForCat=[],j.starred=!1,j.splash=!1,j.questions=h.model.questions,j.id=parseInt(c.id,10),j.disqus={url:d.absUrl(),id:j.id},h.GetQuestions().then(function(){j.question=l.findObjectById(j.questions[k],j.id),j.question.tags.indexOf("seen")<0&&j.question.tags.push("seen")}),b.SetAnswer=function(a){j.alert=!1,j.answers[a]=!j.answers[a]};var m=function(a,b){for(var c=a.length-1;c>=0;c--)a[c]===b&&a.splice(c,1)};b.ValidateAnswer=function(){var a=j.question.v.split(" "),c=[];j.valid="",angular.forEach(j.answers,function(a,b){a&&c.push(b)}),0===c.length?j.alert=!0:(j.valid=angular.equals(c,a.sort()),m(j.question.tags,"corect"),m(j.question.tags,"incorect"),j.valid?(j.question.tags.push("corect"),e(function(){b.NextQuestion()},1e3)):j.question.tags.push("incorect"),j.quizmode||(j.alert=!0),j.valid||e(function(){j.alert=!1},2500),h.SaveQuestions())},b.NextQuestion=function(){b.ResetAnsweres(),d.path("/intrebare").search({cat:k,id:j.id+1})},b.PrevQuestion=function(){b.ResetAnsweres(),d.path("/intrebare").search({cat:k,id:j.id-1})},b.ResetAnsweres=function(){j.answers.a=!1,j.answers.b=!1,j.answers.c=!1},b.HideAlert=function(){j.alert=!1,b.ResetAnsweres()},b.ShowRightAnswers=function(){b.HideAlert();var a=j.question.v.split(" ");angular.forEach(a,function(a){j.answers[a]=!j.answers[a]})},b.MarkQuestion=function(){l.markQuestion(j.question)},b.popover={title:"Salveaza intrebarea",content:'In meniul din stanga, click pe "Categoria '+k.toUpperCase()+' -> Toate intrebarile"'}}]),app.controller("ListQuestionsCtrl",["$rootScope","$scope","$routeParams","$location","$timeout","$q","data","taggedFilter",function(a,b,c,d,e,f,g,h){"use strict";var i=b.model={},j=(window.localStorage,[]);i.category=c.cat,i.questions=g.model.questions,i.tags=[{name:"Intrebari corecte",tag:"corect",selected:!1},{name:"Intrebari gresite",tag:"incorect",selected:!1},{name:"Intrebari salvate",tag:"mark",selected:!1}],b.$watch("model.tags",function(){j=[],angular.forEach(i.tags,function(a){a.selected&&j.push(a.tag)}),j.length>0?i.questionsList=h(i.questions[i.category],j):i.questionsList=i.questions[i.category]},!0),g.GetQuestions().then(function(){i.questionsList=i.questions[i.category];var a=[];angular.forEach(i.questionsList,function(b){b.p&&a.push(b)})})}]),app.controller("LegisCtrl",["$rootScope","$scope","$routeParams","$location","$timeout","$q","data",function(a,b,c,d,e,f,g){"use strict";var h=b.model={};window.localStorage;g.GetLegis({}).then(function(a){console.log(a),h.legis=a},function(a){console.log(a)})}]),app.directive("dirDisqus",["$window",function(a){return{restrict:"E",scope:{disqus_shortname:"@disqusShortname",disqus_identifier:"@disqusIdentifier",disqus_title:"@disqusTitle",disqus_url:"@disqusUrl",disqus_category_id:"@disqusCategoryId",disqus_disable_mobile:"@disqusDisableMobile",readyToBind:"@"},template:'<div id="disqus_thread"></div><a href="http://disqus.com" class="dsq-brlink">comments powered by <span class="logo-disqus">Disqus</span></a>',link:function(b){if("undefined"==typeof b.disqus_identifier||"undefined"==typeof b.disqus_url)throw"Please ensure that the `disqus-identifier` and `disqus-url` attributes are both set.";b.$watch("readyToBind",function(c){if(angular.isDefined(c)||(c="true"),b.$eval(c))if(a.disqus_shortname=b.disqus_shortname,a.disqus_identifier=b.disqus_identifier,a.disqus_title=b.disqus_title,a.disqus_url=b.disqus_url,a.disqus_category_id=b.disqus_category_id,a.disqus_disable_mobile=b.disqus_disable_mobile,a.DISQUS)a.DISQUS.reset({reload:!0,config:function(){this.page.identifier=b.disqus_identifier,this.page.url=b.disqus_url,this.page.title=b.disqus_title}});else{var d=document.createElement("script");d.type="text/javascript",d.async=!0,d.src="//"+b.disqus_shortname+".disqus.com/embed.js",(document.getElementsByTagName("head")[0]||document.getElementsByTagName("body")[0]).appendChild(d)}})}}}]),app.factory("data",["$rootScope","$http","$q",function(a,b,c){"use strict";var d="local",e=window.localStorage,f={questions:{},user:{}},g=function(){var a=c.defer();if($.isEmptyObject(f.questions)){var d=JSON.parse(e.getItem("questions"));$.isEmptyObject(d)||d.all?b.get("/questions.json").success(function(b){angular.copy(b,f.questions),a.resolve(f.questions),h()}).error(function(b){a.reject(b)}):(angular.copy(d,f.questions),a.resolve(f.questions))}else a.resolve(f.questions);return a.promise},h=function(){var a=c.defer();return e.setItem("questions",JSON.stringify(f.questions)),a.promise},i=function(){e.removeItem("questions")},j=function(){var a=c.defer();return b.get("/legis.json").success(function(b){a.resolve(b)}).error(function(b){a.reject(b)}),a.promise},k=function(){var a=c.defer(),b=JSON.parse(e.getItem("user"));return $.isEmptyObject(b)?a.resolve(f.user):(angular.copy(b,f.user),a.resolve(f.user)),a.promise},l=function(){var a=c.defer();return e.setItem("user",f.user),a.resolve(f.user),a.promise};return{env:d,model:f,GetQuestions:g,GetLegis:j,SaveQuestions:h,RemoveQuestions:i,SaveUser:l,GetUser:k}}]),angular.module("autohack").run(["$templateCache",function(a){"use strict";a.put("views/dashboard.html",'<div class="dashboard">\n	<h1>Dashboard</h1>\n\n	<div class="row questions-statistics">\n		<div class="col-md-3" ng-show="model.a.corect + model.a.incorect > 0">\n			<h5><strong>Categoria A</strong> <span>{{model.a.total}} intrebari</span>:</h5>\n			<dl>\n				<dt>Raspunsuri corecte: </dt>\n				<dd>{{model.a.corect}}</dd>\n				<dt>Raspunsuri gresite:</dt>\n				<dd>{{model.a.incorect}}</dd>\n				<dt>Total parcurse: </dt>\n				<dd>{{ model.a.corect + model.a.incorect }}</dd>\n			</dl>\n		</div>\n		<div class="col-md-3" ng-show="model.b.corect + model.b.incorect > 0">\n			<h5><strong>Categoria B</strong> <span>{{model.b.total}} intrebari</span>:</h5>\n			<dl>\n				<dt>Raspunsuri corecte: </dt>\n				<dd>{{model.b.corect}}</dd>\n				<dt>Raspunsuri gresite:</dt>\n				<dd>{{model.b.incorect}}</dd>\n				<dt>Total parcurse: </dt>\n				<dd>{{ model.b.corect + model.b.incorect }}</dd>\n			</dl>\n		</div>\n		<div class="col-md-3" ng-show="model.c.corect + model.c.incorect > 0">\n			<h5><strong>Categoria C</strong> <span>{{model.c.total}} intrebari</span>:</h5>\n			<dl>\n				<dt>Raspunsuri corecte: </dt>\n				<dd>{{model.c.corect}}</dd>\n				<dt>Raspunsuri gresite:</dt>\n				<dd>{{model.c.incorect}}</dd>\n				<dt>Total parcurse: </dt>\n				<dd>{{ model.c.corect + model.c.incorect }}</dd>\n			</dl>\n		</div>\n		<div class="col-md-3" ng-show="model.d.corect + model.d.incorect > 0">\n			<h5><strong>Categoria D</strong> <span>{{model.d.total}} intrebari</span>:</h5>\n			<dl>\n				<dt>Raspunsuri corecte: </dt>\n				<dd>{{model.d.corect}}</dd>\n				<dt>Raspunsuri gresite:</dt>\n				<dd>{{model.d.incorect}}</dd>\n				<dt>Total parcurse: </dt>\n				<dd>{{ model.d.corect + model.d.incorect }}</dd>\n			</dl>\n		</div>\n	</div>\n\n</div>'),a.put("views/legis.html",'<div class="legis col-md-8">\n  <h1>Codul Rutier 2014</h1>\n  \n  <div class="search row">\n    <div class="col-md-6">\n      <div class="form-group">\n        <input type="text" class="form-control" placeholder="Cautare Codul Rutier" ng-model="model.search">\n        <span class="fa fa-search"></span>\n      </div>\n    </div>\n  </div>\n\n  <div class="chapters" ng-repeat="chapters in model.legis | filter:model.search">\n    <h2>{{chapters.content}}</h2>\n\n    <div class="level1" ng-repeat="level1 in chapters.level1 | filter:model.search">\n      <h3>{{level1.content}}</h3>\n\n      <ul class="level2">\n        \n        <li ng-repeat="level2 in level1.level2 | filter:model.search">\n          {{level2.content}}\n\n          <ul class="level3">\n            \n            <li ng-repeat="level3 in level2.level3 | filter:model.search">\n\n              {{level3.content}}\n\n              <ul class="level4">\n                \n                <li ng-repeat="level4 in level3.level4 | filter:model.search">\n                  \n                  {{level4.content}}\n\n                  <ul class="level5">\n\n                    <li ng-repeat="level5 in level4.level5 | filter:model.search">\n                      \n                      {{level5.content}}\n\n                    </li>                    \n\n                  </ul>\n\n                </li>\n\n              </ul> <!-- level4 -->\n\n            </li>\n\n          </ul> <!-- level3 -->\n\n        </li>\n\n      </ul> <!-- level2 -->\n      \n    </div>\n  </div>\n</div>'),a.put("views/list.html",'<div class="row list">\n  <div class="col-md-2 tags-col">\n    <div class="tags">\n      <h4>Filtre:</h4>\n      <ul class="list list-unstyled">\n        <li ng-repeat="tag in model.tags">\n          <label for="{{tag.tag}}">\n            \n            <input type="checkbox" name="" id="{{tag.tag}}" ng-model="tag.selected" /> \n            {{tag.name}}\n\n          </label>\n        </li>\n      </ul>\n    </div>\n  </div> <!-- col-md-2 -->\n\n  <div class="col-md-10">\n    <div class="row">\n      <h2 class="col-md-8">Lista de intrebari categoria {{model.category | uppercase}}: </h2>\n      \n      <div class="search row col-md-4 ">\n        <div class="form-group">  \n          <input type="text" class="form-control" placeholder="Cautare intrebari" ng-model="model.search">\n          <span class="fa fa-search"></span>\n        </div>\n      </div>\n    </div>\n\n    <ol class="list questions-list">\n      <li ng-repeat="question in model.questionsList | filter:model.search track by $index">\n        \n        <a href="#!/intrebare?cat={{model.category}}&id={{question.id}}" \n'+"           ng-class=\"{'corect': question.tags.indexOf('corect') >= 0, 'incorect': question.tags.indexOf('incorect') >= 0, 'seen': question.tags.indexOf('seen') >= 0 }\">\n          {{question.q}}\n        </a>\n      </li>\n    </ol>\n  </div>\n</div>"),a.put("views/order.html",'<div id="modal-order" class="reveal-modal modal-order" ng-controller="OrderCtrl" data-reveal>\n\n	<div class="order-loading" ng-show="model.orderLoading">\n\n		<h2>\n			<i class="fa fa-refresh fa-spin"></i>\n			Sending order..\n		</h2>\n\n	</div>\n\n	<div class="order-success" ng-show="model.orderSuccess">\n\n		<h2>\n			<i class="fa fa-check"></i>\n			Thank you for your order!\n		</h2>\n\n		<p>\n			Check your email for more details on the progress of the order.\n		</p>\n\n	</div>\n\n	<a class="close-reveal-modal">&#215;</a>\n\n	<h2>\n		Order Cards\n		<small>\n			Highest print quality at the best prices!\n		</small>\n	</h2>\n\n	<div class="row">\n\n		<div class="large-4 columns">\n			<label>Choose one of our exclusive offers</label>\n\n			<ul class="offers-list">\n\n				<div class="loading-indicator" ng-show="!model.offers.length">\n					<i class="fa fa-refresh fa-spin"></i>\n					Loading offers..\n				</div>\n\n				<li ng-repeat="offer in model.offers">\n\n					<label ng-class="{ \'active\' : model.order.selectedOffer == $index }">\n						<input type="radio" name="offers" ng-value="$index" ng-model="model.order.selectedOffer">\n\n						<h3 ng-bind="offer.title"></h3>\n\n						<p class="description">\n							<img ng-src="{{ ImageUrl(offer._links.image.href) }}" class="icon">\n							<span ng-bind="offer.description"></span>\n						</p>\n\n						<p class="price">\n							Price:\n							<span ng-bind="offer.amount.currency"></span>\n							<span ng-bind="(offer.amount.total / 100).toFixed(2)"></span>\n						</p>\n\n						<p class="details">\n							<span ng-bind="offer.details"></span>\n						</p>\n\n					</label>\n\n				</li>\n\n			</ul>\n		</div>\n\n		<div class="large-8 columns">\n\n			<form name="orderForm" id="orderForm" ng-submit="SendOrder($event)">\n\n				<div class="alert-box warning" ng-show="model.error">\n\n					<strong>There was an error with your order. </strong>\n					<p ng-bind="model.error"></p>\n\n				</div>\n\n				<div class="row">\n					<div class="large-4 columns">\n						<label>\n							Your email\n\n							<input type="email"\n								ng-model="model.order.email"\n								required>\n\n						</label>\n					</div>\n					<div class="large-4 columns">\n						<label>\n							Full name\n\n							<input type="text"\n								ng-model="model.order.name"\n								required>\n\n						</label>\n					</div>\n					<div class="large-4 columns" ng-class="{ \'error\': orderForm.phone.$invalid }">\n						<label>\n							Phone\n\n							<input type="text"\n								ng-model="model.order.phone"\n								ng-minlength="7"\n								maxlength="32"\n								name="phone"\n								required>\n\n						</label>\n\n						<small class="error" ng-show="orderForm.phone.$invalid">Phone number must be between 7 and 32 characters long. </small>\n					</div>\n				</div>\n\n				<h4>\n					Billing details\n				</h4>\n\n				<div class="row">\n					<div class="large-3 columns">\n						<label>\n							Country\n\n							<select\n								ng-model="model.order.country"\n								ng-options="c.name for c in model.countries"\n								required>\n							</select>\n\n						</label>\n						<small>We only ship to the US and Canada</small>\n					</div>\n					<div class="large-3 columns">\n						<label>\n\n							<span ng-show="model.order.country.id==\'United States\'">\n								State\n							</span>\n\n							<span ng-show="model.order.country.id==\'Canada\'">\n								Province\n							</span>\n\n							<select\n								ng-model="model.order.region"\n								ng-options="s.name for s in model.regions[model.order.country.id]"\n								required>\n							</select>\n\n						</label>\n					</div>\n					<div class="large-3 columns">\n						<label>\n							City\n\n							<input type="text"\n								ng-model="model.order.city"\n								required>\n\n						</label>\n					</div>\n					<div class="large-3 columns">\n						<label>\n							Postal code\n\n							<input type="text"\n								ng-model="model.order.postcode"\n								required>\n\n						</label>\n					</div>\n				</div>\n\n				<div class="row">\n					<div class="large-12 columns">\n						<label>\n							Address line 1\n\n							<input type="text"\n								ng-model="model.order.address1"\n								required>\n\n						</label>\n					</div>\n				</div>\n\n				<div class="row">\n					<div class="large-12 columns">\n						<label>\n							Address line 2\n\n							<input type="text"\n								ng-model="model.order.address2">\n\n						</label>\n					</div>\n				</div>\n\n				<h4>\n					Payment\n				</h4>\n\n				<div class="row">\n					<div class="large-4 columns">\n						<label>\n							Credit Card number\n\n							<input type="text"\n								payment="formatCardNumber"\n								x-autocompletetype="cc-number"\n								placeholder="Card number"\n								ng-model="model.order.card.number"\n								card-type="model.order.card.type"\n								class="cc-number"\n								ng-class="{\n									\'card-visa\': model.order.card.type === \'visa\'\n								}"\n								required>\n\n						</label>\n					</div>\n					<div class="large-4 columns">\n						<label>\n							Expiry date\n\n							<input type="text"\n								payment="formatCardExpiry"\n								x-autocompletetype="cc-exp"\n								placeholder="Expires MM/YY"\n								maxlength="9"\n								ng-model="model.order.card.exp"\n								required>\n\n						</label>\n					</div>\n					<div class="large-4 columns" ng-class="{ \'error\': orderForm.cvc.$invalid }">\n						<label>\n							Security code\n\n							<input type="text"\n								x-autocompletetype="cc-csc"\n								placeholder="Security code"\n								maxlength="4"\n								autocomplete="off"\n								payment="formatCardCVC"\n								ng-model="model.order.card.csc"\n								card-number="order.card.number"\n								ng-minlength="3"\n								name="cvc"\n								required>\n\n						</label>\n\n						<small class="error" ng-show="orderForm.cvc.$invalid">Security code must have at least 3 characters. </small>\n\n						<small class="cvc-help">\n							<img src="/images/creditcard-cvc.png">\n\n							The <strong>last 3 digits</strong> in the signature strip of your card.\n						</small>\n					</div>\n				</div>\n\n				<h4>\n					Shipping details\n				</h4>\n\n				<div class="row">\n					<div class="large-6 columns">\n\n						<input type="radio"\n							name="shipping-details"\n							value="same"\n							id="shipping-standard"\n							ng-model="model.order.shippingDetailsType"\n							selected>\n\n						<label for="shipping-standard">\n							Use same details as Billing\n						</label>\n\n					</div>\n					<div class="large-6 columns">\n\n						<input type="radio"\n							name="c"\n							value="custom"\n							id="shipping-custom"\n							ng-model="model.order.shippingDetailsType">\n\n						<label for="shipping-custom">\n							Use different details\n						</label>\n\n					</div>\n				</div>\n\n				<div class="shipping-details-extra"\n					ng-show="model.order.shippingDetailsCustom">\n\n					<div class="row">\n						<div class="large-6 columns">\n							<label>\n								Full name\n\n								<input type="text"\n									ng-model="model.shipping.name"\n									ng-required="model.order.shippingDetailsCustom">\n\n							</label>\n						</div>\n						<div class="large-6 columns">\n							<label>\n								Phone\n\n								<input type="text"\n									ng-model="model.shipping.phone"\n									ng-required="model.order.shippingDetailsCustom">\n\n							</label>\n						</div>\n					</div>\n\n					<div class="row">\n						<div class="large-3 columns">\n							<label>\n								Country\n\n								<select\n									ng-model="model.shipping.country"\n									ng-options="c.name for c in model.countries">\n								</select>\n\n							</label>\n\n							<small>We only ship to the US and Canada</small>\n\n						</div>\n						<div class="large-3 columns">\n							<label>\n								<span ng-show="model.shipping.country.id==\'United States\'">\n									State\n								</span>\n\n								<span ng-show="model.shipping.country.id==\'Canada\'">\n									Province\n								</span>\n\n								<select\n									ng-model="model.shipping.region"\n									ng-options="s.name for s in model.regions[model.shipping.country.id]">\n								</select>\n\n							</label>\n						</div>\n						<div class="large-3 columns">\n							<label>\n								City\n\n								<input type="text"\n									ng-model="model.shipping.city"\n									ng-required="model.order.shippingDetailsCustom">\n\n							</label>\n						</div>\n						<div class="large-3 columns">\n							<label>\n								Postal code\n\n								<input type="text"\n									ng-model="model.shipping.postcode"\n									ng-required="model.order.shippingDetailsCustom">\n\n							</label>\n						</div>\n					</div>\n\n					<div class="row">\n						<div class="large-12 columns">\n							<label>\n								Address line 1\n\n								<input type="text"\n									ng-model="model.shipping.address1"\n									ng-required="model.order.shippingDetailsCustom">\n\n							</label>\n						</div>\n					</div>\n\n					<div class="row">\n						<div class="large-12 columns">\n							<label>\n								Address line 2\n\n								<input type="text"\n									ng-model="model.shipping.address2">\n\n							</label>\n						</div>\n					</div>\n\n				</div>\n\n				<div class="order-summary" ng-show="model.offers[model.order.selectedOffer]">\n\n					<h4>\n						Order summary\n					</h4>\n\n					<table>\n						<tbody>\n							<tr>\n								<td>\n									{{ model.offers[model.order.selectedOffer].title }}\n								</td>\n								<td>\n									<strong>\n										<span ng-bind="model.offers[model.order.selectedOffer].amount.currency"></span>\n										<span ng-bind="(model.offers[model.order.selectedOffer].amount.total / 100).toFixed(2)"></span>\n									</strong>\n								</td>\n							</tr>\n						</tbody>\n					</table>\n\n				</div>\n\n				<button type="submit" class="button radius button-send" ng-disabled="!model.offers.length">\n\n					<i class="fa fa-shopping-cart"></i>\n					Send Order\n\n					<strong ng-show="model.offers[model.order.selectedOffer]">\n						-\n\n						<span ng-bind="model.offers[model.order.selectedOffer].amount.currency"></span>\n						<span ng-bind="(model.offers[model.order.selectedOffer].amount.total / 100).toFixed(2)"></span>\n					</strong>\n\n				</button>\n\n				<p class="printchomp-text">\n					Orders are processed by\n					<a href="https://www.printchomp.com/" target="_blank">Printchomp</a>\n				</p>\n\n				<p class="privacy-agree">\n					By sending the order you agree to the\n\n					<a href="http://chompedia.printchomp.com/customer/portal/articles/711085-terms-of-service" target="_blank">\n						Printchomp Terms of Service\n					</a>\n\n					and the\n\n					<a href="/privacy.html" target="_blank">bizcardmaker.com</a>\n					and\n\n					<a href="http://chompedia.printchomp.com/customer/portal/articles/711086-privacy-statement" target="_blank">Printchomp</a>\n\n					privacy policies.\n			</form>\n\n		</div>\n	</div>\n\n</div>\n'),a.put("views/question.html",'<div class="quiz-question" ng-class="{\'hide\': model.splash}">\n\n  <div class="toolbar" ng-show="model.quizmode">\n    <div class="separator">\n      <span>Total: </span>\n      <span>{{model.statistics.total}}</span>\n    </div>\n\n    <div class="separator">\n      <span>Ramase: </span>\n      <span>{{model.statistics.left}}</span>\n    </div>\n\n    <div class="separator">\n      <span class="fa fa-check"></span>\n      <span>Raspunsuri corecte: </span>\n      <span>{{model.statistics.corect.length || 0}}</span>\n    </div>\n\n    <div class="separator">\n      <span class="fa fa-times"></span>\n      <span>Raspunsuri gresite: </span>\n      <span>{{model.statistics.incorect.length || 0}}</span>\n    </div>\n\n    <div class="separator">\n      <span class="fa fa-clock-o"></span>\n      <strong>{{model.timer.minutes}}:{{model.timer.seconds}}</strong>\n    </div>\n\n  </div>\n\n  <h2 class="question">\n    <span class="question-index" ng-show="model.quizmode">{{model.question.tempId}}</span>\n\n    {{model.question.q}}\n    \n    <span\n      class="fa"\n      ng-click="MarkQuestion()"\n      ng-class="{\'fa-star-o\': model.question.tags.indexOf(\'mark\') < 0, \'fa-star\': model.question.tags.indexOf(\'mark\') >= 0}"\n      \n      data-placement="right" data-animation="am-flip-x" data-trigger="hover" bs-popover="popover" data-html="true"\n      >\n    </span>\n  </h2>\n\n\n  <div class="image">\n    <img ng-src="images/{{model.question.p}}" ng-show="model.question.p">\n  </div>\n\n  <ol class="answers">\n    <li ng-click="SetAnswer(\'a\')" ng-class="{\'selected\':model.answers.a}">A. {{model.question.a}}</li>\n    <li ng-click="SetAnswer(\'b\')" ng-class="{\'selected\':model.answers.b}">B. {{model.question.b}}</li>\n    <li ng-click="SetAnswer(\'c\')" ng-class="{\'selected\':model.answers.c}">C. {{model.question.c}}</li>\n  </ol>\n\n\n  <div class="set-answers">\n    <a class="btn btn-default btn-lg" ng-click="SetAnswer(\'a\')" ng-class="{\'btn-primary\':model.answers.a}">A</a>\n    <a class="btn btn-default btn-lg" ng-click="SetAnswer(\'b\')" ng-class="{\'btn-primary\':model.answers.b}">B</a>\n    <a class="btn btn-default btn-lg" ng-click="SetAnswer(\'c\')" ng-class="{\'btn-primary\':model.answers.c}">C</a>\n  </div>\n\n  <div class="buttons">\n    <a class="prev" href="" ng-click="PrevQuestion()" ng-show="model.id > 1 && !model.quiz" >\n      <span class="fa-chevron-left fa"></span>\n    </a>\n\n    <a class="btn btn-default" href="" ng-click="AnswerLater()" ng-show="model.quizmode">Raspund mai tarziu</a>\n    \n    <a class="btn btn-primary" href="" ng-click="ValidateAnswer()">Trimite Raspuns</a>\n\n    <a class="next" href="" ng-click="NextQuestion()" ng-show="!model.quiz">\n      <span class="fa-chevron-right fa"></span>\n    </a>\n  </div>\n\n  <div class="row">\n\n    <div class="col-md-6 col-md-offset-3 center-text">\n      <a href="" ng-show="!model.quizmode" ng-click="ShowRightAnswers()" class="text-muted">Arata raspuns corect</a>\n      <div class="alert-custom" ng-show="model.alert" ng-class="{\'alert-custom-danger\': !model.valid, \'alert-custom-success\': model.valid }">\n        \n        <p ng-if="!model.valid">Raspuns incorect. <span ng-if="model.valid === \'\'">Va rugam selectati cel putin un raspuns</span></p>\n        <p ng-if="model.valid">Raspuns corect.</p>\n        \n        \n\n      </div>\n    </div>\n  </div>\n  \n  <div class="disqus" ng-hide="model.quizmode">\n    \n    <div class="row">\n      <div class="col-md-10 col-md-offset-1">\n        <dir-disqus disqus-shortname="autoquiz"\n                 disqus-identifier="{{ model.disqus.id }}"\n                 disqus-url="{{ model.disqus.url }}">\n        </dir-disqus>\n      </div>\n    </div>\n\n  </div> <!-- disqus -->\n</div> <!-- question -->\n\n<div class="splash" ng-show="model.splash">\n  <h1 ng-if="model.quizValid">Ati fost declarat ADMIS la examenul teoretic</h1>\n  <h1 ng-if="!model.quizValid">Ati fost declarat RESPINS la examenul teoretic</h1>\n  \n\n\n  <h3 ng-show="model.statistics.corect.length">Intrebari la care ati raspuns corect</h3>\n  <ul ng-show="model.statistics.corect.length">\n    <li ng-repeat="answer in model.statistics.corect track by $index">\n      <a href="#!/intrebare?cat={{model.category}}&id={{answer.id}}">{{answer.q}}</a>\n    </li>\n  </ul>\n\n  <h3 ng-show="model.statistics.incorect.length">Intrebari la care ati raspuns gresit</h3>\n  <ul ng-show="model.statistics.incorect.length">\n    <li ng-repeat="answer in model.statistics.incorect track by $index">\n      <a href="#!/intrebare?cat={{model.category}}&id={{answer.id}}">{{answer.q}}</a>\n    </li>\n  </ul>\n  <a href="" class="btn btn-primary" ng-click="NewQuiz()">Chestionar nou</a>\n</div>\n\n')}]);