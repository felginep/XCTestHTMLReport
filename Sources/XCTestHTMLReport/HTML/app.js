    var resizers = document.querySelectorAll('.resizer'),
    leftSidebar = document.getElementById('left-sidebar'),
    rightSidebar = document.getElementById('right-sidebar'),
    sidebar, startX, startWidth, originalWidth,
    screenshot = document.getElementById('screenshot'),
    iframe = document.getElementById('text-attachment');

    updateDesignReviewToggleState();

    for (var i = 0; i < resizers.length; i++) {
        resizers[i].addEventListener('mousedown', initDrag, false);
    }

    var listItems = document.querySelectorAll('.list-item');

    function visibleListItems() {
      var array = Array.prototype.slice.call(listItems);
      return array.filter(function(el) { return el.offsetParent != null; })
    }

    var selectedListItem;
    for (var i = 0; i < listItems.length; i++) {
      listItems[i].addEventListener('mousedown', listItemMouseDown, false);
    }

    function listItemMouseDown(e) {
      var item = e.target;
      while (item && !item.classList.contains('list-item')) {
        item = item.parentElement;
      }

      selectListItem(item);
    }

    function selectListItem(listItem) {
      if (selectedListItem) {
        selectedListItem.classList.remove("selected");
      }

      selectedListItem = listItem;
      selectedListItem.classList.add("selected");

      var firstAttachment = selectedListItem.querySelector('.attachment .preview-icon');

      if (firstAttachment == null) {
        hideScreenshot();
        hideLog();
        showAttachmentPlaceholder();
        return;
      }

      var path = firstAttachment.attributes["data"].value;
      var extension = path.split('.').pop();
      var textExtension = ["txt", "crash", "html"];
      if (textExtension.indexOf(extension) != -1) {
        showText(path);
      } else {
        showScreenshot(path);
      }
    }

    function selectDevice(deviceId, el) {
      while (el && !el.classList.contains('device-info')) {
        el = el.parentElement;
      }

      document.querySelectorAll('.device-info.selected')[0].classList.remove("selected");
      el.classList.add("selected");

      document.querySelectorAll('.run.active')[0].classList.remove("active");
      document.querySelectorAll('#device_' + deviceId)[0].classList.add("active");
    }

    function keyDown(e) {
        e = e || window.event;

        var items = visibleListItems();
        if (e.keyCode == 40) {
          e.preventDefault();
          var index = Array.prototype.slice.call(visibleListItems()).indexOf(selectedListItem) + 1;
          navigateListItems(items.slice(index, items.length));
        } else if (e.keyCode == 38) {
          e.preventDefault();
          var index = Array.prototype.slice.call(visibleListItems()).indexOf(selectedListItem) + 1;
          navigateListItems(items.slice(0, index - 1).reverse());
        } else if (e.keyCode == 39) {
          unfoldCurrentListItem();
        } else if (e.keyCode == 37) {
          foldCurrentListItem();
        }
    }

    function foldCurrentListItem() {
      var dropIcon = selectedListItem.querySelector('.drop-down-icon');
      if (dropIcon == null) {
        return;
      }

      if (dropIcon.classList.contains("dropped")) {
        selectedListItem.querySelector('.drop-down-icon').onclick();
      }
    }

    function unfoldCurrentListItem() {
      var dropIcon = selectedListItem.querySelector('.drop-down-icon');
      if (dropIcon == null) {
        return;
      }

      if (!dropIcon.classList.contains("dropped")) {
        selectedListItem.querySelector('.drop-down-icon').onclick();
      }
    }

    function navigateListItems(items) {
      if (selectedListItem) {
        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          if (item.offsetParent) {
            selectListItem(item);

            var scrollView = document.querySelector('.run.active .tests');
            if (!divInsideOfDiv(item, scrollView)) {
              scrollToItem(item);
            }

            return;
          }
        }
      } else {
        selectListItem(items[0]);
      }
    }

    function scrollToItem(item) {
      var scrollView = document.querySelector('.run.active .tests'),
          itemBounds = item.getBoundingClientRect(),
          scrollBounds = scrollView.getBoundingClientRect();

      if (itemBounds.bottom > scrollBounds.bottom) {
        scrollView.scrollBy(0, itemBounds.bottom - scrollBounds.bottom);
      } else if (itemBounds.top < scrollBounds.top) {
        scrollView.scrollBy(0, itemBounds.top - scrollBounds.top);
      }
    }

    function divInsideOfDiv(divA, divB) {
      var boundariesA = divA.getBoundingClientRect();
      var boundariesB = divB.getBoundingClientRect();

      return boundariesA.top >= boundariesB.top &&
       boundariesA.bottom <= boundariesB.bottom;
    }

    document.onkeydown = keyDown;


    function initDrag(e) {
      sidebar = e.target.parentElement;
      startX = e.clientX;
      startWidth = parseInt(document.defaultView.getComputedStyle(sidebar).width, 10);
      originalSidebarWidth = sidebar.clientWidth;
      document.documentElement.addEventListener('mousemove', doDrag, false);
      document.documentElement.addEventListener('mouseup', stopDrag, false);

      document.body.classList.add('dragging');
    }

    function doDrag(e) {
      var newSidebarWidth,
      distance = startX - e.clientX;

      if (sidebar == leftSidebar) {
        newSidebarWidth = Math.min(Math.max(originalSidebarWidth - distance, 200), 500);
      } else if (sidebar == rightSidebar) {
        newSidebarWidth = Math.min(Math.max(originalSidebarWidth + distance, 300), 800);
      }

      sidebar.style.width = newSidebarWidth + 'px';
    }

    function stopDrag(e) {
      document.documentElement.removeEventListener('mousemove', doDrag, false);
      document.documentElement.removeEventListener('mouseup', stopDrag, false);

      document.body.classList.remove('dragging')
    }

    function toggle(el, id) {
      el.classList.toggle('dropped');
      var activities = document.getElementById('activities-'+id);
      var attachments = document.getElementById('attachments-'+id);
      var designReviewActivities = document.getElementById('design-review-'+id);
      if (activities) {
        activities.style.display = (activities.style.display == 'block' ? 'none' : 'block');
      }

      if (attachments) {
        attachments.style.display = (attachments.style.display == 'block' ? 'none' : 'block');
      }

      if (designReviewActivities) {
        var currentDisplay = window.getComputedStyle(document.getElementById('design-review-'+id)).display;
        designReviewActivities.style.display = (currentDisplay == 'flex' ? 'none' : 'flex');
        updateDesignReviewToggleState();
      }
    }

    function showAttachmentPlaceholder() {
      var placeholder = document.querySelector("#right-sidebar h2");
      placeholder.style.display = "block";
    }

    function hideAttachmentPlaceholder() {
      var placeholder = document.querySelector("#right-sidebar h2");
      placeholder.style.display = "none";
    }

    function hideLog() {
      iframe.style.display = "none";
    }

    function showText(path) {
      hideAttachmentPlaceholder();
      hideScreenshot();
      iframe.style.display = "block";
      iframe.src = path;
    }

    function hideScreenshot() {
      screenshot.style.display = "none";
    }

    function showScreenshot(filename) {
      hideAttachmentPlaceholder();
      hideLog();
      var image = document.getElementById('screenshot-'+filename);
      screenshot.style.display = "block";
      screenshot.src = image.src;
    }

    function setDisplayToElementsWithSelector(sel, display) {
      [].forEach.call(document.querySelectorAll(sel), function (el) {
        el.style.display = display;
      });
    }

    function hideElementsWithSelector(sel) {
      setDisplayToElementsWithSelector(sel, 'none');
    }

    function showElementsWithSelector(sel) {
      setDisplayToElementsWithSelector(sel, 'block');
    }

    function selectedElement(el) {
      el.parentElement.querySelectorAll('.selected')[0].classList.remove('selected');
      el.classList.add('selected');
    }

    function showAllScenarios(el) {
      selectedElement(el);
      showElementsWithSelector('.run.active .test-summary.succeeded');
      showElementsWithSelector('.run.active .test-summary.failed');
      hideSummaryGroupsIfNeeded();
    }

    function showSuccessfulScenariosOnly(el) {
      selectedElement(el);
      showElementsWithSelector('.run.active .test-summary.succeeded');
      hideElementsWithSelector('.run.active .test-summary.failed');
      hideSummaryGroupsIfNeeded();
    }

    function showFailedScenariosOnly(el) {
      selectedElement(el);
      showElementsWithSelector('.run.active .test-summary.failed');
      hideElementsWithSelector('.run.active .test-summary.succeeded');
      hideSummaryGroupsIfNeeded();
    }

    function hideSummaryGroupsIfNeeded() {
      var testSummaryGroups = Array.prototype.slice.call(document.querySelectorAll('.run.active .test-summary-group'));
      for (var i = 0; i < testSummaryGroups.length; i++) {
          var testSummaryGroup = testSummaryGroups[i];
          var children = Array.prototype.slice.call(testSummaryGroup.children);
          var testSummaries = children.filter(function(a) { return a.classList.contains('test-summary'); });
          if (testSummaries.length == 0) {
            continue;
          }

          if (testSummaries.filter(function(a) { return a.style.display == 'block' }).length == 0) {
            testSummaryGroup.style.display = 'none';
          } else {
            testSummaryGroup.style.display = 'block';
          }
      }
    }

    function showLogs(el) {
      selectedElement(el);
      setDisplayToElementsWithSelector('.tests', 'none');
      setDisplayToElementsWithSelector('#logs', 'flex');
      setDisplayToElementsWithSelector('#design-review', 'none');
      setDisplayToElementsWithSelector('#right-sidebar', 'none');
    }

    function showTests(el) {
      selectedElement(el);
      setDisplayToElementsWithSelector('.tests', 'flex');
      setDisplayToElementsWithSelector('#logs', 'none');
      setDisplayToElementsWithSelector('#design-review', 'none');
      setDisplayToElementsWithSelector('#right-sidebar', 'flex');
    }

    function showDesignReview(el) {
        selectedElement(el);
        setDisplayToElementsWithSelector('.tests', 'none');
        setDisplayToElementsWithSelector('#logs', 'none');
        setDisplayToElementsWithSelector('#design-review', 'flex');
        setDisplayToElementsWithSelector('#right-sidebar', 'none');
    }

    function showTestLogs(el) {
        selectedElement(el);
        showElementsWithSelector('#test-logs-iframe');
        hideElementsWithSelector('#app-logs-iframe');
    }

    function showApplicationLogs(el) {
        selectedElement(el);
        showElementsWithSelector('#app-logs-iframe');
        hideElementsWithSelector('#test-logs-iframe');
    }

    function collapseAllDesignReviews() {
        activateAllDesignReviews(isDropped);
    }

    function expandAllDesignReviews() {
        activateAllDesignReviews(isNotDropped);
    }

    function activateAllDesignReviews(predicate) {
        document
            .querySelectorAll('.design_review_activity .activity_name span')
            .forEach(function(el) {
                if (predicate(el)) {
                    el.onclick()
                }
            });
        updateDesignReviewToggleState();
    }

    function updateDesignReviewToggleState() {
        updateCollapseAllSelectedState();
        updateExpandAllSelectedState();
    }

    function updateCollapseAllSelectedState() {
        updateDesignReviewToggleSelectedState('collapse_all', isNotDropped);
    }

    function updateExpandAllSelectedState() {
        updateDesignReviewToggleSelectedState('expand_all', isDropped);
    }

    function isDropped(el) {
        return el.classList.contains('dropped');
    }

    function isNotDropped(el) {
        return !el.classList.contains('dropped');
    }

    function updateDesignReviewToggleSelectedState(id, predicate) {
        let shouldSelect = Array
        .from(
            document.querySelectorAll('.design_review_activity .activity_name span')
        )
        .every(predicate);
        if (shouldSelect) {
            document.getElementById(id).classList.add('selected');
        } else {
            document.getElementById(id).classList.remove('selected');
        }
    }

    document.querySelectorAll('.device-info')[0].classList.add("selected");
    document.querySelectorAll('.run')[0].classList.add("active");