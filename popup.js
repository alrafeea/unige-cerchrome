
var menu = [];
getWindowLink();
function openModel(modalSize, state, postId, postSource, postLink) {
  var size = '';
  var height = 800;
  switch (modalSize) {
    case 'sm':
      size = 'modal-sm';
      break;
    case 'md':
      size = '';
      break;

    case 'lg':
      size = 'modal-lg';
      break;

    default:
      size = '';
      break;
  }
  var linke =
    'https://certify-a47d4.firebaseapp.com/' +
    state +
    '/' +
    postId +
    '/' +
    postSource;
  if (postLink != '') linke += '?link=' + postLink;
  var iframe =
    '<div style="height:' +
    height +
    'px">  <iframe frameborder="0"  width="500px" height="100%" src="' +
    linke +
    '"></iframe></div>';

  var modal = $(
    `<div class="modal fade " tabindex="-1" role="dialog"  aria-hidden="true">
  <div class="modal-dialog ` +
      size +
      `" role="document">
    <div class="modal-content">
   ` +
      iframe +
      `
   
    
    </div>
  </div>
</div>`
  );
  modal.modal({
    keyboard: false,
  });
}
var link = "";
console.log("link:"+link)
//Only add for twitter
//if (link.indexOf('twitter.com') > -1) {
  console.log(link.indexOf('twitter.com') > -1)
  if (menu.length == 0) {
    chrome.runtime.sendMessage({ contentScriptQuery: 'menu' }, (apiMenu) => {
      menu = apiMenu.map((item) => {
        return {
          name: item.title,
          disabled: item.isActive == false,
          size:item.size,
          state:item.state,
          callback: function (key, opt) {
            if (item.isActive == true) {
              openModel(
                item.size,
                item.state,
                opt.$trigger.attr('post-id'),
                opt.$trigger.attr('post-src'),
                opt.$trigger.attr('post-link')
              );
            } else {
              return;
            }
          },
        };
      });
      menu.forEach(element => {
        AppendMenuItem(element.name,element.state,element.size,element.disabled)
      });
    });
  }
//}
else{
  $("#invalid-link").show();
}


function AppendMenuItem(name,state,size,isDsiabled){
  var ul = document.getElementById("items-container");
  var li = document.createElement("li");
  li.appendChild(document.createTextNode(name));
  li.setAttribute("id", name); 
  li.setAttribute("data-state", state); 
  li.setAttribute("data-size", size); 
  li.setAttribute("data-disbales", isDsiabled); 
  li.setAttribute("class", isDsiabled ? 'disabled' : 'active'); 
  //li.setAttribute("onclick", listEvent); 
  li.addEventListener("click",function(){
    $('.modal').remove();
    $("#items-container").remove();
    //call the get link 
	var pageLink = getWindowLink();
	var encodedLink = encodeURIComponent(pageLink.replace(/\//g, ''));

    openModel(size, state, encodedLink, 'web', pageLink)
  }); 
  ul.appendChild(li);

}


//set the window link from the extension
function getWindowLink(){
  
  chrome.tabs.getSelected(null, function(tab) {
    var tablink = tab.url
    link = tablink
  });
   return link
}
