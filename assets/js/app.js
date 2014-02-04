$(function() {
  $('[title]').tooltip();

  $('.use-datepicker').datepicker({
    format: 'yyyy/mm/dd',
    todayHighlight: true,
    autoclose: true,
  });
});

$(function() {
  // helper to setup the offset adjustments for hilighting
  // portions of the article
  var $article = $('#show-document .article-text');

  if ($article.length > 0) {
    var originalText = $article.data('original');

    var htmlEscape = function(str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    };

    var highlightOffsets = function(offsets) {
      var text = originalText;
      var accumulatedOffset = 0;

      for (var i = 0; i < offsets.length; i++) {
        var offset = offsets[i];
        offset[0] += i * 13;

        text = text.slice(0, offset[0]) +
               '<mark>' + text.slice(offset[0], offset[0]+offset[1]) + '</mark>' +
               text.slice(offset[0]+offset[1]);
      }

      // Do HTML escape and unescape the mark tags. This technically lets
      // someone inject mark tags, but we're okay with that, it makes this easy.
      text = htmlEscape(text)
        .replace(/\&lt;mark\&gt;/g, '<mark>')
        .replace(/\&lt;\/mark&gt;/g, '</mark>')
        // now add <br> in the same way the server does
        .replace(/\n+/g, "\n")
        .replace(/\n/g, "\n")
        .replace(/\n/g, "</p>");

      $article.html('<p>' + text + '</p>');
    };

    var highlightEntities = function(container) {
      var $elems;

      if ($(container).data('offsets')) {
        $elems = $(container);
      } else {
        $elems = $('[data-offsets]', $(container));
      }

      var offsets = $.makeArray($elems.map(function(i, row) { return $(row).data('offsets'); }));
      if (offsets.length > 0) {
        offsets = offsets.join(' ').trim().split(/ +/);
        offsets = $.map(offsets, function(e) {
          var pair = e.split(':');
          return [[parseInt(pair[0]), parseInt(pair[1])]];
        });
        offsets.sort(function(a, b) { return a[0] - b[0]; });
      }

      highlightOffsets(offsets);
    };

    $('#show-document .tabs a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
      // highlight entities for the active pane
      highlightEntities($($(e.target).attr('href')));
    });

    $('#show-document .table.entities tr').on('mouseover', function(e) {
      highlightEntities($(this));
    });

    $('#show-document .table.entities tr').on('mouseout', function(e) {
      highlightEntities($('#show-document .tab-pane.active'));
    });

    highlightEntities($('#show-document .tab-pane.active'));
  }
});
