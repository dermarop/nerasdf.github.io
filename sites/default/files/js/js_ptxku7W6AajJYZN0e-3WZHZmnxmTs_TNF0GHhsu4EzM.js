(function($) {

/**
 * jQuery debugging helper.
 *
 * Invented for Dreditor.
 *
 * @usage
 *   $.debug(var [, name]);
 *   $variable.debug( [name] );
 */
jQuery.extend({
  debug: function () {
    // Setup debug storage in global window. We want to look into it.
    window.debug = window.debug || [];

    args = jQuery.makeArray(arguments);
    // Determine data source; this is an object for $variable.debug().
    // Also determine the identifier to store data with.
    if (typeof this == 'object') {
      var name = (args.length ? args[0] : window.debug.length);
      var data = this;
    }
    else {
      var name = (args.length > 1 ? args.pop() : window.debug.length);
      var data = args[0];
    }
    // Store data.
    window.debug[name] = data;
    // Dump data into Firebug console.
    if (typeof console != 'undefined') {
      console.log(name, data);
    }
    return this;
  }
});
// @todo Is this the right way?
jQuery.fn.debug = jQuery.debug;

})(jQuery);
;

(function($) {
  Drupal.behaviors.CToolsJumpMenu = {
    attach: function(context) {
      $('.ctools-jump-menu-hide')
        .once('ctools-jump-menu')
        .hide();

      $('.ctools-jump-menu-change')
        .once('ctools-jump-menu')
        .change(function() {
          var loc = $(this).val();
          var urlArray = loc.split('::');
          if (urlArray[1]) {
            location.href = urlArray[1];
          }
          else {
            location.href = loc;
          }
          return false;
        });

      $('.ctools-jump-menu-button')
        .once('ctools-jump-menu')
        .click(function() {
          // Instead of submitting the form, just perform the redirect.

          // Find our sibling value.
          var $select = $(this).parents('form').find('.ctools-jump-menu-select');
          var loc = $select.val();
          var urlArray = loc.split('::');
          if (urlArray[1]) {
            location.href = urlArray[1];
          }
          else {
            location.href = loc;
          }
          return false;
        });
    }
  };
})(jQuery);
;
/**
 * @file
 * Adds smooth scrolling to TOC anchor links.
 *
 * From: Scroll window smoothly in jQuery - Animated scroll
 *       http://blog.freelancer-id.com/2009/03/26/scroll-window-smoothly-in-jquery/
 */

(function ($) {

Drupal.tocFilterScrollToOnClick = function() {
  // Make sure links still has hash.
  if (!this.hash || this.hash == '#') {
    return true;
  }

  // Make sure the href is pointing to an anchor link on this page.
  var href = this.href.replace(/#[^#]*$/, '');
  var url = window.location.toString();
  if (href && url.indexOf(href) === -1) {
    return true;
  }

  // Scroll to the anchor
  return Drupal.tocFilterScrollTo(this.hash);
}

Drupal.tocFilterScrollTo = function(hash) {
  // Find hash target.
  var $a = $('a[name=' + hash.substring(1) + ']');

  // Make hash target is on the current page.
  if (!$a.length) {
    return true;
  }

  // Scroll to hash target
  var duration = Drupal.settings.toc_filter_smooth_scroll_duration || 'medium';
  $('html, body').animate({scrollTop: $a.offset().top}, duration);

  // Move focus to targets back to top link.
  // Target anchor not focused; breaks keyboard navigation https://drupal.org/node/2058875
  $a.parent().prev('.toc-filter-back-to-top').find('a').focus();

  return false;
}

Drupal.behaviors.tocFilterSmoothScroll = {
  attach: function (context) {
    // Only map <a href="#..."> links
    $('a[href*="#"]', context).once('toc-filter').click(Drupal.tocFilterScrollToOnClick);
  }
};

// Override CToolsJumpMenu behavior for TOC filter jumpmenus.
Drupal.behaviors.tocFilterCToolsJumpMenu = {
  attach: function(context) {
    $('.toc-filter-jump-menu .ctools-jump-menu-change:not(.toc-filter-jump-menu-processed)')
      .addClass('toc-filter-jump-menu-processed')
      .unbind('change')
      .change(function() {
        // Find our sibling value.
        var $select = $(this).parents('form').find('.ctools-jump-menu-select');
        var hash = $select.val();
        if (hash) {
          Drupal.tocFilterScrollTo(hash);
        }
        $select.find('option:first').attr('selected', true);
        return false;
      });
  }
};

})(jQuery)
;
