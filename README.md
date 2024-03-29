# adapt-tabs-audio  

**Tabs** is a *presentation component* for the [Adapt framework](https://github.com/adaptlearning/adapt_framework).

Each heading tab is associated with a hidden content panel. Clicking a heading toggles the visibility of its content panel. The first content panel is visible by default. Content panels may contain text and/or an image.

## Installation

This component must be manually installed.  

If **Tabs** has been uninstalled from the Adapt authoring tool, it may be reinstalled using the [Plug-in Manager](https://github.com/adaptlearning/adapt_authoring/wiki/Plugin-Manager).  

## Settings Overview

The attributes listed below are used in *components.json* to configure **Tabs**, and are properly formatted as JSON in [*example.json*](https://github.com/deltanet/adapt-tabs-audio/blob/master/example.json).

### Attributes

**_id** (string): A unique identifier.

**_parentId** (string): An identifier that links the component to the parent block.

**_type** (string): The type of the particular item. Examples include block and component.

**_component** (string): This value must be: `tabs`.

**_classes** (string): CSS class name to be applied to **Tabs**’s containing div. The class must be predefined in one of the Less files. Separate multiple classes with a space.

**_layout** (string): This defines the horizontal position of the component in the block. Acceptable values are `full`, `left` or `right`.

**title** (string): The title of the particular item.

**displayTitle** (string): This is the title that Adapt displays when viewing a course.

**body** (string): The body text content of the particular item.

**instruction** (string): This optional text appears above the component. It is frequently used to guide the learner’s interaction with the component.  

**_tabLayout** (string): Defines the layout of the tabs. Acceptable values are `left` and `top`. By default, component displays `left` layout for medium screen size and below.

**_showBorder** (boolean): If set to `true`, a border will be added around the item content.

**_items** (array): Multiple items may be created. Each _item_ represents one element of the tabs component and contains values for **tabTitle**, **title**, **body**, and **_graphic**.

>**tabTitle** (string): This text is displayed in the actual tab heading. Recommendation to keep this title short.

>**title** (string): This text is displayed as the content panel's header. It is displayed when the tab has been selected.

>**body** (string): This content will be displayed when the learner opens this content panel. It may contain HTML.  

>**instruction** (string): This optional text appears below the item body text as instructional text.    

>**_graphic** (object): An optional image which is displayed below the item body when the learner opens this content panel. It contains values for **src** and **alt**.

>>**src** (string): File name (including path) of the image. Path should be relative to the *src* folder (e.g., *course/en/images/tabs.jpg*).

>>**alt** (string): This text becomes the image’s `alt` attribute.  

### Accessibility
**Tabs** has been assigned a label using the [aria-label](https://github.com/adaptlearning/adapt_framework/wiki/Aria-Labels) attribute: **ariaRegion**. This label is not a visible element. It is utilized by assistive technology such as screen readers. Should the region's text need to be customised, it can be found within the **globals** object in course.json.

----------------------------
**Version number:**  4.2.2  
**Framework versions:** 5.8+  
**Author / maintainer:** DeltaNet  
**Accessibility support:** WAI AA   
**RTL support:** Yes  
**Authoring tool:** Yes
