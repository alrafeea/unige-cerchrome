var articles = [];
var menu = [];

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
    'px">  <iframe frameborder="0"  width="100%" height="100%" src="' +
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
if (menu.length == 0) {
  chrome.runtime.sendMessage({ contentScriptQuery: 'menu' }, (apiMenu) => {
    menu = apiMenu.map((item) => {
      return {
        name: item.title,
        disabled: item.isActive == false,
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
  });
}

//In case of single post page
var twitterHandle = '';
var twitterPostId = '';

function isTweetDetailsPage() {
  var singlePostRegex = new RegExp(
    /(https:\/\/twitter\.com)\/(\w+)\/(status)\/(\d+)/
  );
  var url = window.location.href;
  var isSingleTweet = singlePostRegex.test(url);
  if (isSingleTweet) {
    twitterHandle = url.match(singlePostRegex)[2];
    twitterPostId = url.match(singlePostRegex)[4];
  }

  return isSingleTweet;
}

function getFacebookPostId(link) {
  var facebookLinkRegex = new RegExp(
    /(https:\/\/(www.)?facebook\.com)(\/[\w\[.\]\\]+)+\/(\d+)/
  );
  var isPostLink = facebookLinkRegex.test(link);
  if (!isPostLink) {
    var oldPhotosLinkRegex = new RegExp(
      /(https:\/\/(www.)?facebook\.com)\/([\w\[.\]\\]+)?(\?(story_fbid|fbid)=)(\d+)/
    );
    var isPostLink = oldPhotosLinkRegex.test(link);
    if (!isPostLink) {
      return null;
    }
    postId = link.match(oldPhotosLinkRegex)[5];
    return postId;
  }

  postId = link.match(facebookLinkRegex)[4];
  return postId;
}

if (window.location.href.indexOf('facebook.com') > -1) {
  //$('[role$="article"]').css('border', '3px solid red');
  window.addEventListener('scroll', function () {
    $('[role$="article"]').each(function () {
      var isOldFacebook = false;
      var headerContainer = $(this).find('.dati1w0a').first();
      if (headerContainer.length === 0) {
        headerContainer = $(this).find('._5eit');
        isOldFacebook = true;
      }
      var timeLinkContainer = headerContainer.find('[id^="jsc_c_"]');
      if (timeLinkContainer.length === 0)
        timeLinkContainer = headerContainer.find('abbr');
      const timeLink = timeLinkContainer.closest('a');
      const postlink = timeLink.prop('href');
      var postId = getFacebookPostId(timeLink.prop('href'));
      if (postId != null) {
        postId = postId.trim();
        var btn = buildAddButton(postId, 'facebook', postlink);
        var relatedElement;
        if (!isOldFacebook) {
          relatedElement = headerContainer.find('[aria-haspopup$="menu"]');
        } else {
          relatedElement = headerContainer.find('h5,h6').first();
          relatedElement.css('position', 'relative');
          btn.css({ right: '15px', position: 'absolute' });
        }
        if (articles.indexOf(postId) == -1) {
          articles.push(postId);
          // Find element related to the button

          if (!isOldFacebook) {
            relatedElement.parent().parent().children().last().before(btn);
          } else {
            relatedElement.children().append(btn);
          }
        } else {
          if ($.find('#add-' + postId).length == 0) {
            if (!isOldFacebook) {
              relatedElement.parent().parent().children().last().before(btn);
            } else {
              relatedElement.children().append(btn);
            }
          }
        }
      }
    });
  });
}

setTimeout(function () {
  $('article time').each(function () {
    var link = $(this).parent().prop('href');
    if (link == null || link == undefined) {
      return;
    }
    var linkeArr = link.split('/');
    var id = linkeArr[linkeArr.length - 1];

    if (articles.indexOf(id) == -1) {
      articles.push(id);

      var btn = buildAddButton(id, 'twitter', link);
      $(this).parent().parent().parent().children().last().prepend(btn);
    } else {
    }
  });

  if (isTweetDetailsPage()) {
    var moreButton = $('[aria-label$="More"]').first();
    var btn = buildAddButton(twitterPostId, 'twitter',  window.location.href);
    moreButton.parent().parent().children().last().prepend(btn);
  }
}, 2000);
window.addEventListener('scroll', function () {
  $('article time').each(function () {
    var link = $(this).parent().prop('href');
    if (link == null || link == undefined) {
      return;
    }
    var linkeArr = link.split('/');
    var id = linkeArr[linkeArr.length - 1];
    var btn = buildAddButton(id, 'twitter', link);
    if (articles.indexOf(id) == -1) {
      setTimeout(function () {
        articles.push(id);

        $(this).parent().parent().parent().children().last().prepend(btn);
      }, 300);
    } else {
      if ($.find('#add-' + id).length == 0) {
        $(this).parent().parent().parent().children().last().prepend(btn);
      }
    }
  });
  if (isTweetDetailsPage()) {
    var moreButton = $('[aria-label$="More"]').first();
    var btn = buildAddButton(twitterPostId, 'twitter',  window.location.href);
    if (articles.indexOf(twitterPostId) == -1) {
      articles.push(twitterPostId);
      moreButton.parent().parent().children().last().prepend(btn);
    } else {
      if ($.find('#add-' + twitterPostId).length == 0) {
        moreButton.parent().parent().children().last().prepend(btn);
      }
    }
  }
});

function buildGetButton(id) {
  var button = $('<button id="get-' + id + '"/>')
    .text('Get')
    .click(function () {
      chrome.runtime.sendMessage(
        { contentScriptQuery: 'getPost', postId: id },
        (post) => alert(post.name)
      );

      return false;
    });

  return button;
}

function buildAddButton(id, source, link) {
  if(!link) link = '';
  var linke = 'https://certify-a47d4.firebaseapp.com/home/' + id + '/' + source;
  var iframe = $(
    '<div style="height:400px;width:400px;">  <iframe frameborder="0"  width="100%" height="100%" src="' +
      linke +
      '"></iframe></div>'
  );
  // '';
  var button = $(
    '<button class="certify-btn" id="add-' +
      id +
      '"  post-id="' +
      id +
      '" post-src="' +
      source +
      '"  post-link="' +
      link +
      '" />'
  ).text('');
  iconUrl = chrome.extension.getURL('images/Cx48.png');
  button.css('background-image', 'url("' + iconUrl + '")');

  button.css("background-size","23px");
  $.contextMenu({
    selector: '#add-' + id,
    trigger: 'left',
    callback: function (key, options) {},
    items: menu,
  });

  return button;
}
