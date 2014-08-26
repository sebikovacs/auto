var app=angular.module("autohack",["ngRoute","ngTouch"]).config(["$routeProvider",function(a){"use strict";a.when("/chestionare-auto-toate-intrebarile/:id",{templateUrl:"views/allquestions.html",controller:"AllQuestionsCtrl",reloadOnSearch:!1}).when("/intrebari-raspuns-corect",{templateUrl:"views/list.html",controller:"ListQuestionsCtrl",reloadOnSearch:!1}).when("/intrebari-raspuns-gresit",{templateUrl:"views/list.html",controller:"ListQuestionsCtrl",reloadOnSearch:!1}).when("/intrebari-marcate",{templateUrl:"views/list.html",controller:"ListQuestionsCtrl",reloadOnSearch:!1}).otherwise({redirectTo:"/"})}]);app.run(["$rootScope",function(a){"use strict";var b=a.root={};b.smallScreen=screen.width<=1024}]),app.directive("fileread",[function(){"use strict";return{scope:{fileread:"="},link:function(a,b){b.bind("change",function(b){a.$apply(function(){a.fileread=b.target.files[0]})})}}}]),app.directive("payment",[function(){"use strict";return{require:"ngModel",scope:{payment:"@",cardNumber:"=",cardType:"=",ngModel:"="},link:function(a,b,c,d){b.payment(a.payment);var e=function(b){return b?(a.cardType=$.payment.cardType(b),void($.payment.validateCardNumber(b)?d.$setValidity("payment",!0):d.$setValidity("payment",!1))):!1},f=function(a){return a?void($.payment.validateCardExpiry(b.payment("cardExpiryVal"))?d.$setValidity("payment",!0):d.$setValidity("payment",!1)):!1},g=function(b){return b?void($.payment.validateCardCVC(b,a.cardType)?d.$setValidity("payment",!0):d.$setValidity("payment",!1)):!1};"formatCardNumber"===a.payment?a.$watch("ngModel",e):"formatCardExpiry"===a.payment?a.$watch("ngModel",f):"formatCardCVC"===a.payment&&a.$watch("ngModel",g)}}}]),app.controller("AllQuestionsCtrl",["$rootScope","$scope","$routeParams","$location","$timeout","$q","data",function(a,b,c,d,e,f,g){"use strict";var h=b.model={},i=(b.root,window.localStorage);h.answers={a:!1,b:!1,c:!1},h.alert=!1,h.current=parseInt(c.id,10),h.questions={correct:[],incorrect:[],starred:[]},h.starred=!1;var j=function(a,b,c){var d,e=!1;for(d=0;d<a.length;d++)if(a[d].id===b.id){e=!0;break}return c?d:e},k=function(a){var b;return angular.forEach(h.questions.all,function(c){c.id===a&&(b=c)}),b},l=function(a){for(var b=null,c=0;c<h.questions.all.length;c++)if(h.questions.all[c].id==a){b=h.questions.all[c+1].id;break}return b},m=function(a){for(var b=null,c=0;c<h.questions.all.length;c++)if(h.questions.all[c].id==a){b=h.questions.all[c-1].id;break}return b};h.initQuestionsModel=function(){i.getItem("questions")&&"object"==typeof JSON.parse(i.getItem("questions"))?(h.questions=angular.extend(h.questions,JSON.parse(i.getItem("questions"))),h.question=k(h.current)):g.GetQuestions({}).then(function(a){h.questions.all=a,h.question=k(h.current),b.StoreData()},function(){})},h.initQuestionsModel(),b.StarQuestion=function(){h.starred=!h.starred,j(h.questions.starred,h.question)?h.questions.starred.splice(j(h.questions.starred,h.question,!0),1):h.questions.starred.push(h.question),b.StoreData()},b.StoreData=function(){i.setItem("questions",JSON.stringify(h.questions))},b.SetAnswer=function(a){h.alert=!1,h.answers[a]=!h.answers[a]},b.ValidateAnswer=function(){var a=h.question.v.split(" "),c=[];angular.forEach(h.answers,function(a,b){a&&c.push(b)}),h.valid=angular.equals(c.sort(),a.sort()),h.alert=!0,h.valid?(j(h.questions.correct,h.question)||h.questions.correct.push(h.question),e(function(){h.alert=!1,b.NextQuestion(),h.starred=!1},3e3)):j(h.questions.incorrect,h.question)||h.questions.incorrect.push(h.question),b.StoreData()},b.NextQuestion=function(){d.path("chestionare-auto-toate-intrebarile/"+l(h.current)),b.StoreData(),b.ResetAnsweres(),h.starred=!1},b.PrevQuestion=function(){d.path("chestionare-auto-toate-intrebarile/"+m(h.current)),b.StoreData(),b.ResetAnsweres(),h.starred=!1},b.ResetAnsweres=function(){h.answers.a=!1,h.answers.b=!1,h.answers.c=!1}}]),app.controller("ListQuestionsCtrl",["$rootScope","$scope","$routeParams","$location","$timeout","$q","data",function(a,b,c,d){"use strict";var e=b.model={},f=(b.root,window.localStorage);e.initQuestionsModel=function(){e.questions=f.getItem("questions")&&"object"==typeof JSON.parse(f.getItem("questions"))?JSON.parse(f.getItem("questions")):null},e.initQuestionsModel(),e.questions&&("/intrebari-raspuns-corect"==d.path()?(e.questionsList=e.questions.correct,e.listName="corecte"):"/intrebari-raspuns-gresit"==d.path()?(e.questionsList=e.questions.incorrect,e.listName="gresite"):"/intrebari-marcate"==d.path()&&(e.questionsList=e.questions.starred,e.listName="marcate"))}]),app.factory("data",["$rootScope","$http","$q",function(a,b,c){"use strict";var d="http://sandbox.printchomp.com",e="http://localhost:8080",f="local";"dev.bizcardmaker.com"===document.domain&&(f="dev"),"stage.bizcardmaker.com"===document.domain&&(f="stage"),"www.bizcardmaker.com"===document.domain&&(f="live"),"dev"===f&&(e="https://dev-bizcardmaker.rhcloud.com"),("live"===f||"stage"===f)&&(e="https://live-bizcardmaker.rhcloud.com",d="https://printchomp.com");var g={offers:[]},h=function(){var a=c.defer();return b.get("/questions.json").success(function(b){a.resolve(b)}).error(function(b){a.reject(b)}),a.promise},i=function(){var a=c.defer();return b.get(e+"/api/v1/offers").success(function(b){a.resolve(b)}).error(function(b){a.reject(b)}),a.promise},j=function(a){var d=c.defer();return b.post(e+"/api/v1/orders",a).success(function(a){d.resolve(a)}).error(function(a){d.reject(a)}),d.promise};return{printchompUrl:d,env:f,model:g,GetOffers:i,SendOrder:j,GetQuestions:h}}]),angular.module("autohack").run(["$templateCache",function(a){"use strict";a.put("views/allquestions.html",'\n  <h1>Chestionar auto cu toate intrebarile</h1>\n\n  <div class="row">\n    <div class="col-lg-2">\n      <table class="table">\n        <tr>\n          <td>Toate:</td>\n          <td><span class="label label-default">{{model.questions.all.length}}</span></td>\n        </tr>\n        <tr>\n          <td>Parcurse:</td>\n          <td><span class="label label-default">{{model.current}}</span></td>\n        </tr>\n        <tr>\n          <td>Neparcurse:</td>\n          <td><span class="label label-default">{{model.questions.all.length - model.current}}</span></td>\n        </tr>\n      </table>\n    </div>\n    <div class="col-lg-2">\n      <table class="table">\n        <tr>\n          <td><a href="#/intrebari-raspuns-corect">Corecte</a>:</td>\n          <td><span class="label label-success">{{model.questions.correct.length}}</span></td>\n        </tr>\n        <tr>\n          <td><a href="#/intrebari-raspuns-gresit">Incorecte</a>:</td>\n          <td><span class="label label-danger">{{model.questions.incorrect.length}}</span></td>\n        </tr>\n        <tr>\n          <td><a href="#/intrebari-marcate">Marcate</a>:</td>\n          <td><span class="label label-warning">{{model.questions.starred.length}}</span></td>\n        </tr>\n      </table>\n    </div>\n  </div>\n\n  <hr>\n\n  <div class="alert" ng-show="model.alert" ng-class="{true: \'alert-success\', false: \'alert-danger\'}[model.valid]">\n    <p ng-show="model.valid">Raspuns corect.</p>\n    <p ng-hide="model.valid">Raspuns gresit.</p>\n  </div>\n\n  <h2 class="question">#{{model.current}}. {{model.question.q}} \n    <span \n      class="fa fa-star-o" \n      ng-click="StarQuestion()" \n      ng-class="{\'fa-star\': model.starred, \'fa-star-o\': !model.starred,}" ng-mouseenter="hover = true" ng-mouseleave="hover = false"></span>\n  </h2>\n  <img ng-src="images/{{model.question.p}}" ng-show="model.question.p">\n\n  <div>\n    <ol class="answers">\n      <li ng-click="SetAnswer(\'a\')" ng-class="{\'selected\':model.answers.a}">A. {{model.question.a}}</li>\n      <li ng-click="SetAnswer(\'b\')" ng-class="{\'selected\':model.answers.b}">B. {{model.question.b}}</li>\n      <li ng-click="SetAnswer(\'c\')" ng-class="{\'selected\':model.answers.c}">C. {{model.question.c}}</li>\n    </ol>\n  </div>\n  \n  <div class="set-answeres">\n    <a class="btn btn-default" ng-click="SetAnswer(\'a\')" ng-class="{\'btn-primary\':model.answers.a}">A</a>\n    <a class="btn btn-default" ng-click="SetAnswer(\'b\')" ng-class="{\'btn-primary\':model.answers.b}">B</a>\n    <a class="btn btn-default" ng-click="SetAnswer(\'c\')" ng-class="{\'btn-primary\':model.answers.c}">C</a>\n  </div>\n  \n  <div class="buttons">\n    <a class="btn btn-default" href="" ng-click="PrevQuestion()" ng-show="model.current > 1">\n      <span class="fa-chevron-left fa"></span>\n    </a>\n    <a class="btn btn-primary" href="" ng-click="ValidateAnswer()">Trimite Raspuns</a>\n    <a class="btn btn-default" href="" ng-click="NextQuestion()">\n      <span class="fa-chevron-right fa"></span>\n    </a>\n  </div>\n  \n'),a.put("views/cardeditor.html",'<section class="themes-box">\n\n	<div class="row">\n		<div class="large-12 columns">\n			<h2>Choose a design</h2>\n		</div>\n	</div>\n\n	<div class="themes-row" id="js-themes">\n\n		<a ng-href="#/?theme={{ $index }}" class="theme-item {{ theme.name }}-thumb" ng-repeat="theme in model.themes" ng-class="{ active: $index == model.activeTheme }">\n			<div class="theme-preview-container">\n				<div class="theme-preview"></div>\n			</div>\n		</a>\n\n	</div>\n\n</section>\n\n<section class="card-editor">\n\n	<div class="row">\n\n		<div class="large-8 columns">\n\n			<h2>Customize your business card</h2>\n\n			<div class="card-edit-container">\n\n				<div class="card-container" ng-class="{ \'card-big\': model.generatingCard, \'card-print\': model.generatingPdf }" id="js-card-container">\n					<div class="card-preview {{ model.themes[model.activeTheme].name }}">\n\n						<div class="card-content">\n\n							<input type="file" id="picture-upload" class="file-upload" fileread="model.cardPictureFile">\n\n							<div class="card-picture">\n								<div class="drag-handle"></div>\n\n								<label for="picture-upload" ng-class="{ \'no-picture\': !model.cardPicture }" title="Click to upload your own logo">\n\n									<i class="fa fa-picture-o"></i>\n									<span>Upload your logo</span>\n\n									<img ng-src="{{ model.cardPicture }}">\n\n								</label>\n							</div>\n\n							<ul class="vcard">\n\n								<li class="person" meditor>\n									<div class="drag-handle"></div>\n\n									<p class="fn">\n										John Doe\n									</p>\n									<p class="title">\n										Position\n									</p>\n								</li>\n\n								<li class="details" meditor>\n									<div class="drag-handle"></div>\n\n									<p class="org">\n										Organization\n									</p>\n									<p>\n										<span class="locality">City</span>,\n										<span class="state">State</span>\n									</p>\n									<p class="tel">\n										(123) 555-1234\n									</p>\n								</li>\n\n								<li class="email" meditor>\n									<div class="drag-handle"></div>\n\n									<p>john.doe@cmail.com</p>\n								</li>\n\n								<li class="url" meditor>\n									<div class="drag-handle"></div>\n\n									<p>www.john-doe.com</p>\n								</li>\n							</ul>\n\n						</div>\n\n					</div>\n				</div>\n\n				<ul class="button-group download-buttons">\n					<li>\n\n						<button type="button" class="button secondary" id="js-order-button" ng-click="CopyCardDetails()" data-reveal-id="modal-order" data-reveal>\n							<i class="fa fa-shopping-cart"></i>\n							Print your card\n\n							<small>Get your business card printed and delivered to you at the best quality and price! </small>\n						</button>\n\n						<p class="printchomp-text">\n							Powered by\n							<a href="https://www.printchomp.com/" target="_blank">\n								Printchomp\n							</a>\n						</p>\n\n					</li>\n					<li>\n\n						<a data-dropdown="drop-downloads" class="button muted dropdown" id="js-download-button">\n							<i class="fa fa-arrow-circle-o-down"></i>\n							Download files\n							<small>To print them yourself or use online. </small>\n						</a>\n\n						<ul id="drop-downloads" data-dropdown-content class="f-dropdown">\n							<li>\n								<a ng-click="DownloadPdf()">\n									<i class="fa fa-file-text"></i>\n									Download PDF\n									<small>For printing at home, or at your local printer. </small>\n								</a>\n							</li>\n							<li>\n								<a ng-click="DownloadPicture()">\n									<i class="fa fa-picture-o"></i>\n									Download picture\n\n									<small>For posting online or sharing with other people. </small>\n								</a>\n							</li>\n						</ul>\n\n					</li>\n				</ul>\n\n			</div>\n\n		</div>\n\n		<div class="large-4 columns">\n\n			<div class="instructions-block">\n				<p>\n					Simply click on any of the details on the card, to edit them.\n				</p>\n				<p>\n					Double click or select the text to change its style, size or font.\n				</p>\n				<p>\n					Drag elements around using the dotted borders that show up when placing the mouse over them.\n				</p>\n			</div>\n\n		</div>\n\n	</div>\n\n</section>\n\n<div ng-include="\'views/order.html\'"></div>\n'),a.put("views/list.html",'<h2>Lista intrebarilor {{model.listName}}:</h2>\n\n<ul>\n  <li ng-repeat="question in model.questionsList"><a href="#/chestionare-auto-toate-intrebarile/{{question.id}}">{{question.q}}</a></li>\n</ul>'),a.put("views/order.html",'<div id="modal-order" class="reveal-modal modal-order" ng-controller="OrderCtrl" data-reveal>\n\n	<div class="order-loading" ng-show="model.orderLoading">\n\n		<h2>\n			<i class="fa fa-refresh fa-spin"></i>\n			Sending order..\n		</h2>\n\n	</div>\n\n	<div class="order-success" ng-show="model.orderSuccess">\n\n		<h2>\n			<i class="fa fa-check"></i>\n			Thank you for your order!\n		</h2>\n\n		<p>\n			Check your email for more details on the progress of the order.\n		</p>\n\n	</div>\n\n	<a class="close-reveal-modal">&#215;</a>\n\n	<h2>\n		Order Cards\n		<small>\n			Highest print quality at the best prices!\n		</small>\n	</h2>\n\n	<div class="row">\n\n		<div class="large-4 columns">\n			<label>Choose one of our exclusive offers</label>\n\n			<ul class="offers-list">\n\n				<div class="loading-indicator" ng-show="!model.offers.length">\n					<i class="fa fa-refresh fa-spin"></i>\n					Loading offers..\n				</div>\n\n				<li ng-repeat="offer in model.offers">\n\n					<label ng-class="{ \'active\' : model.order.selectedOffer == $index }">\n						<input type="radio" name="offers" ng-value="$index" ng-model="model.order.selectedOffer">\n\n						<h3 ng-bind="offer.title"></h3>\n\n						<p class="description">\n							<img ng-src="{{ ImageUrl(offer._links.image.href) }}" class="icon">\n							<span ng-bind="offer.description"></span>\n						</p>\n\n						<p class="price">\n							Price:\n							<span ng-bind="offer.amount.currency"></span>\n							<span ng-bind="(offer.amount.total / 100).toFixed(2)"></span>\n						</p>\n\n						<p class="details">\n							<span ng-bind="offer.details"></span>\n						</p>\n\n					</label>\n\n				</li>\n\n			</ul>\n		</div>\n\n		<div class="large-8 columns">\n\n			<form name="orderForm" id="orderForm" ng-submit="SendOrder($event)">\n\n				<div class="alert-box warning" ng-show="model.error">\n\n					<strong>There was an error with your order. </strong>\n					<p ng-bind="model.error"></p>\n\n				</div>\n\n				<div class="row">\n					<div class="large-4 columns">\n						<label>\n							Your email\n\n							<input type="email"\n								ng-model="model.order.email"\n								required>\n\n						</label>\n					</div>\n					<div class="large-4 columns">\n						<label>\n							Full name\n\n							<input type="text"\n								ng-model="model.order.name"\n								required>\n\n						</label>\n					</div>\n					<div class="large-4 columns" ng-class="{ \'error\': orderForm.phone.$invalid }">\n						<label>\n							Phone\n\n							<input type="text"\n								ng-model="model.order.phone"\n								ng-minlength="7"\n								maxlength="32"\n								name="phone"\n								required>\n\n						</label>\n\n						<small class="error" ng-show="orderForm.phone.$invalid">Phone number must be between 7 and 32 characters long. </small>\n					</div>\n				</div>\n\n				<h4>\n					Billing details\n				</h4>\n\n				<div class="row">\n					<div class="large-3 columns">\n						<label>\n							Country\n\n							<select\n								ng-model="model.order.country"\n								ng-options="c.name for c in model.countries"\n								required>\n							</select>\n\n						</label>\n						<small>We only ship to the US and Canada</small>\n					</div>\n					<div class="large-3 columns">\n						<label>\n\n							<span ng-show="model.order.country.id==\'United States\'">\n								State\n							</span>\n\n							<span ng-show="model.order.country.id==\'Canada\'">\n								Province\n							</span>\n\n							<select\n								ng-model="model.order.region"\n								ng-options="s.name for s in model.regions[model.order.country.id]"\n								required>\n							</select>\n\n						</label>\n					</div>\n					<div class="large-3 columns">\n						<label>\n							City\n\n							<input type="text"\n								ng-model="model.order.city"\n								required>\n\n						</label>\n					</div>\n					<div class="large-3 columns">\n						<label>\n							Postal code\n\n							<input type="text"\n								ng-model="model.order.postcode"\n								required>\n\n						</label>\n					</div>\n				</div>\n\n				<div class="row">\n					<div class="large-12 columns">\n						<label>\n							Address line 1\n\n							<input type="text"\n								ng-model="model.order.address1"\n								required>\n\n						</label>\n					</div>\n				</div>\n\n				<div class="row">\n					<div class="large-12 columns">\n						<label>\n							Address line 2\n\n							<input type="text"\n								ng-model="model.order.address2">\n\n						</label>\n					</div>\n				</div>\n\n				<h4>\n					Payment\n				</h4>\n\n				<div class="row">\n					<div class="large-4 columns">\n						<label>\n							Credit Card number\n\n							<input type="text"\n								payment="formatCardNumber"\n								x-autocompletetype="cc-number"\n								placeholder="Card number"\n								ng-model="model.order.card.number"\n								card-type="model.order.card.type"\n								class="cc-number"\n								ng-class="{\n									\'card-visa\': model.order.card.type === \'visa\'\n								}"\n								required>\n\n						</label>\n					</div>\n					<div class="large-4 columns">\n						<label>\n							Expiry date\n\n							<input type="text"\n								payment="formatCardExpiry"\n								x-autocompletetype="cc-exp"\n								placeholder="Expires MM/YY"\n								maxlength="9"\n								ng-model="model.order.card.exp"\n								required>\n\n						</label>\n					</div>\n					<div class="large-4 columns" ng-class="{ \'error\': orderForm.cvc.$invalid }">\n						<label>\n							Security code\n\n							<input type="text"\n								x-autocompletetype="cc-csc"\n								placeholder="Security code"\n								maxlength="4"\n								autocomplete="off"\n								payment="formatCardCVC"\n								ng-model="model.order.card.csc"\n								card-number="order.card.number"\n								ng-minlength="3"\n								name="cvc"\n								required>\n\n						</label>\n\n						<small class="error" ng-show="orderForm.cvc.$invalid">Security code must have at least 3 characters. </small>\n\n						<small class="cvc-help">\n							<img src="/images/creditcard-cvc.png">\n\n							The <strong>last 3 digits</strong> in the signature strip of your card.\n						</small>\n					</div>\n				</div>\n\n				<h4>\n					Shipping details\n				</h4>\n\n				<div class="row">\n					<div class="large-6 columns">\n\n						<input type="radio"\n							name="shipping-details"\n							value="same"\n							id="shipping-standard"\n							ng-model="model.order.shippingDetailsType"\n							selected>\n\n						<label for="shipping-standard">\n							Use same details as Billing\n						</label>\n\n					</div>\n					<div class="large-6 columns">\n\n						<input type="radio"\n							name="c"\n							value="custom"\n							id="shipping-custom"\n							ng-model="model.order.shippingDetailsType">\n\n						<label for="shipping-custom">\n							Use different details\n						</label>\n\n					</div>\n				</div>\n\n				<div class="shipping-details-extra"\n					ng-show="model.order.shippingDetailsCustom">\n\n					<div class="row">\n						<div class="large-6 columns">\n							<label>\n								Full name\n\n								<input type="text"\n									ng-model="model.shipping.name"\n									ng-required="model.order.shippingDetailsCustom">\n\n							</label>\n						</div>\n						<div class="large-6 columns">\n							<label>\n								Phone\n\n								<input type="text"\n									ng-model="model.shipping.phone"\n									ng-required="model.order.shippingDetailsCustom">\n\n							</label>\n						</div>\n					</div>\n\n					<div class="row">\n						<div class="large-3 columns">\n							<label>\n								Country\n\n								<select\n									ng-model="model.shipping.country"\n									ng-options="c.name for c in model.countries">\n								</select>\n\n							</label>\n\n							<small>We only ship to the US and Canada</small>\n\n						</div>\n						<div class="large-3 columns">\n							<label>\n								<span ng-show="model.shipping.country.id==\'United States\'">\n									State\n								</span>\n\n								<span ng-show="model.shipping.country.id==\'Canada\'">\n									Province\n								</span>\n\n								<select\n									ng-model="model.shipping.region"\n									ng-options="s.name for s in model.regions[model.shipping.country.id]">\n								</select>\n\n							</label>\n						</div>\n						<div class="large-3 columns">\n							<label>\n								City\n\n								<input type="text"\n									ng-model="model.shipping.city"\n									ng-required="model.order.shippingDetailsCustom">\n\n							</label>\n						</div>\n						<div class="large-3 columns">\n							<label>\n								Postal code\n\n								<input type="text"\n									ng-model="model.shipping.postcode"\n									ng-required="model.order.shippingDetailsCustom">\n\n							</label>\n						</div>\n					</div>\n\n					<div class="row">\n						<div class="large-12 columns">\n							<label>\n								Address line 1\n\n								<input type="text"\n									ng-model="model.shipping.address1"\n									ng-required="model.order.shippingDetailsCustom">\n\n							</label>\n						</div>\n					</div>\n\n					<div class="row">\n						<div class="large-12 columns">\n							<label>\n								Address line 2\n\n								<input type="text"\n									ng-model="model.shipping.address2">\n\n							</label>\n						</div>\n					</div>\n\n				</div>\n\n				<div class="order-summary" ng-show="model.offers[model.order.selectedOffer]">\n\n					<h4>\n						Order summary\n					</h4>\n\n					<table>\n						<tbody>\n							<tr>\n								<td>\n									{{ model.offers[model.order.selectedOffer].title }}\n								</td>\n								<td>\n									<strong>\n										<span ng-bind="model.offers[model.order.selectedOffer].amount.currency"></span>\n										<span ng-bind="(model.offers[model.order.selectedOffer].amount.total / 100).toFixed(2)"></span>\n									</strong>\n								</td>\n							</tr>\n						</tbody>\n					</table>\n\n				</div>\n\n				<button type="submit" class="button radius button-send" ng-disabled="!model.offers.length">\n\n					<i class="fa fa-shopping-cart"></i>\n					Send Order\n\n					<strong ng-show="model.offers[model.order.selectedOffer]">\n						-\n\n						<span ng-bind="model.offers[model.order.selectedOffer].amount.currency"></span>\n						<span ng-bind="(model.offers[model.order.selectedOffer].amount.total / 100).toFixed(2)"></span>\n					</strong>\n\n				</button>\n\n				<p class="printchomp-text">\n					Orders are processed by\n					<a href="https://www.printchomp.com/" target="_blank">Printchomp</a>\n				</p>\n\n				<p class="privacy-agree">\n					By sending the order you agree to the\n\n					<a href="http://chompedia.printchomp.com/customer/portal/articles/711085-terms-of-service" target="_blank">\n						Printchomp Terms of Service\n					</a>\n\n					and the\n\n					<a href="/privacy.html" target="_blank">bizcardmaker.com</a>\n					and\n\n					<a href="http://chompedia.printchomp.com/customer/portal/articles/711086-privacy-statement" target="_blank">Printchomp</a>\n\n					privacy policies.\n			</form>\n\n		</div>\n	</div>\n\n</div>\n')}]);