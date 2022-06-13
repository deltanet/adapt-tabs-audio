import Adapt from 'core/js/adapt';
import ComponentView from 'core/js/views/componentView';

class TabsView extends ComponentView {

  events () {
    return {
      'click .js-tabs-audio-navigation': 'onTabItemClicked'
    };
  }

  initialize(...args) {
    super.initialize(...args);

    this.setUpEventListeners();
  }

  setUpEventListeners() {
    this.listenTo(Adapt, 'device:resize', this.setLayout);
    this.listenTo(Adapt, 'audio:changeText', this.replaceText);

    this.listenTo(this.model.getChildren(), {
      'change:_isActive': this.onItemsActiveChange,
      'change:_isVisited': this.onItemsVisitedChange
    });
  }

  postRender() {
    this.setLayout();

    this.showContentItemAtIndex(0, true);
    this.setTabSelectedAtIndex(0);

    if (Adapt.audio && this.model.get('_audio') && this.model.get('_audio')._reducedTextisEnabled) {
      this.replaceText(Adapt.audio.textSize);
    }

    this.$('.tabs-audio__widget').imageready(this.setReadyStatus.bind(this));
    if (this.model.get('_setCompletionOn') !== 'inview') return;
    this.setupInviewCompletion('.component__widget');
  }

  setLayout() {
    this.$el.removeClass('tabs-audio-layout-left tabs-audio-layout-top');

    if (Adapt.device.screenSize == 'large') {
      this.$el.addClass('tabs-audio-layout-' + this.model.get('_tabLayout'));
    } else {
      this.$el.addClass('tabs-audio-layout-left');
    }

    // Check if just an image or just text is used in an item
    for (let i = 0; i < this.model.get('_items').length; i++) {
      if (this.model.get('_items')[i]._graphic.src == "" || this.model.get('_items')[i].body == "") {
        this.$('.item-' + i).addClass("fullwidth");
      }
    }
  }

  onTabItemClicked(event) {
    const index = $(event.currentTarget).index();

    this.model.setActiveItem(index);
    this.model.getItem(index).toggleVisited(true);

    const currentItem = this.getCurrentItem(index);

    ///// Audio /////
    if (Adapt.audio && this.model.has('_audio') && this.model.get('_audio')._isEnabled && Adapt.audio.audioClip[this.model.get('_audio')._channel].status == 1) {
      // Reset onscreen id
      Adapt.audio.audioClip[this.model.get('_audio')._channel].onscreenID = "";
      // Trigger audio
      Adapt.trigger('audio:playAudio', currentItem._audio.src, this.model.get('_id'), this.model.get('_audio')._channel);
    }
    ///// End of Audio /////
  }

  ///// Audio /////
  getCurrentItem(index) {
    return this.model.get('_items')[index];
  }
  ///// End of Audio /////

  onItemsActiveChange(item, isActive) {
    if (!isActive) return;

    const index = item.get('_index');

    this.showContentItemAtIndex(index);
    this.setTabSelectedAtIndex(index);
  }

  onItemsVisitedChange(item, _isVisited) {
    if (!_isVisited) return;
    this.$(`[data-index="${item.get('_index')}"]`).addClass('is-visited');
  }

  showContentItemAtIndex(index, skipFocus) {
    const $contentItems = this.$('.tabs-audio-content');
    $contentItems.removeClass('is-active');

    const $contentItem = $contentItems.eq(index);
    $contentItem.addClass('is-active');

    if (skipFocus) return;
    Adapt.a11y.focusFirst($contentItem);
  }

  setTabSelectedAtIndex(index) {
    const $navigationItem = this.$('.tabs-audio-navigation-item');
    $navigationItem.removeClass('is-selected').eq(index).addClass('is-selected').attr('aria-label', this.model.get('_items')[index].tabTitle + '.is-visited');
  }

  // Reduced text
  replaceText(value) {
    // If enabled
    if (Adapt.audio && this.model.get('_audio') && this.model.get('_audio')._reducedTextisEnabled) {
      // Change each items title and body
      for (let i = 0; i < this.model.get('_items').length; i++) {
        if (value == 0) {
          this.$('.tabs-audio-navigation-item-inner').eq(i).html(this.model.get('_items')[i].tabTitle);
          this.$('.tabs-audio-content-item-title-inner').eq(i).html(this.model.get('_items')[i].title);
          this.$('.tabs-audio-content-item-body-inner').eq(i).html(this.model.get('_items')[i].body);
        } else {
          this.$('.tabs-audio-navigation-item-inner').eq(i).html(this.model.get('_items')[i].tabTitleReduced);
          this.$('.tabs-audio-content-item-title-inner').eq(i).html(this.model.get('_items')[i].titleReduced);
          this.$('.tabs-audio-content-item-body-inner').eq(i).html(this.model.get('_items')[i].bodyReduced);
        }
      }
    }
  }
}

TabsView.template = 'tabs';

export default TabsView;
