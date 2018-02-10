angular.module('RedditMyersBriggs', [
  'RedditMyersBriggs.controllers',
  'RedditMyersBriggs.services'
])
.config(function($httpProvider){
  $httpProvider.defaults.headers.post['Content-Type'] = 'text/plain'
});
