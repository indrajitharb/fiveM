function resize() {}

function show_loader() {
  $("body").append(
    '<div class="swal-popup-box"><div class="swal-preloader pl-xxl"><svg viewBox="25 25 50 50" class="pl-circular"><circle r="20" cy="50" cx="50" class="plc-path"/></svg></div></div><span class="swal-popup-bg"></span>'
  );
}

function remove_popup() {
  $(".swal-popup-box,.swal-popup-bg").remove();
}

$(document).ready(function () {
  resize();

  $("select.selecty").selecty();

  $("#formUpload label").addClass("btn btn-default btn-brand");
  $("#formUpload label").text("Upload Avatar");
  $("#formUpload input").css({
    visiblity: "hidden",
    width: "0",
    height: "0",
  });

  function change_checkbox_status($selector) {
    var $this = $selector;
    var text = $this.attr("data-text");
    if (text) {
    } else {
      text = $this.parents("label").find("b").text();
    }
    var selected_text = $this.attr("data-selected-text");
    if (selected_text) {
    } else {
      selected_text = text;
    }
    var checked = $this.prop("checked");
    if (checked) {
      $this.parents(".check-area").addClass("checked");
      $this.parents("label").find("b").text(selected_text);
      $this.parents("label").find("span.icon").addClass("icon-ok");
      $this.parents("label").find("span.icon").removeClass("icon-plus");
      $this.parents("section.box-bottom").addClass("box-shadow-spread");
    } else {
      $this.parents(".check-area").removeClass("checked");
      $this.parents("label").find("b").text(text);
      $this.parents("label").find("span.icon").removeClass("icon-ok");
      $this.parents("label").find("span.icon").addClass("icon-plus");
      $this.parents("section.box-bottom").removeClass("box-shadow-spread");
    }
  }

  $('input[type="checkbox"]').each(function () {
    change_checkbox_status($(this));
  });

  $('input[type="checkbox"]').change(function () {
    change_checkbox_status($(this));
  });

  $(".check-parent").click(function () {
    $(this).find('input[type="checkbox"]').click();
  });

  $(document).on("click", ".action-button", function (e) {
    e.preventDefault();
    $this = $(this);
    var text = $this.attr("data-text");
    var type = "warning";
    var confirmButtonText = "Yes";
    var confirmButtonColor = "#DD6B55";
    var id = $this.attr("data-id");
    var url = $this.attr("href");
    var title = $this.attr("data-title");
    if (!title) {
      title = "Are you sure?";
    }
    var isReload = $this.hasClass("reload");
    var isRedirect = $this.hasClass("redirect");
    var showAlert = $this.hasClass("with_alert");
    var isRemove = $this.hasClass("remove");
    var noLoader = $this.hasClass("no-loader");
    var noPopup = $this.hasClass("no-popup");

    swal({
      title: title,
      text: text,
      type: type,
      showCancelButton: true,
      confirmButtonColor: confirmButtonColor,
      confirmButtonText: confirmButtonText,
      closeOnConfirm: true,
      closeOnCancel: true,
    }).then(function (isConfirm) {
      if (isConfirm) {
        show_loader();

        window.setTimeout(function () {
          jQuery.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            data: {
              pk: id,
            },
            success: function (data) {
              var message = data["message"];
              var status = data["status"];
              var redirect = data["redirect"];
              var redirect_url = data["redirect_url"];
              var stable = data["stable"];
              var title = data["title"];

              remove_popup();

              if (status == "true") {
                if (title) {
                  title = title;
                } else {
                  title = "Success";
                }

                function doAfter() {
                  if (isRemove) {
                    var row_length = $this.parents("tbody").find("tr").length;
                    $this.parents("tr").remove();
                    var end = parseInt($(".current_end_status").html());
                    var total = parseInt($(".total_count").html());
                    $(".total_count").html(total - 1);
                    $(".current_end_status").html(end - 1);
                    if (row_length <= 1) {
                      window.location.reload();
                    }
                  }
                  if (stable != "true") {
                    if (isRedirect && redirect == "true") {
                      window.location.href = redirect_url;
                    }
                    if (isReload) {
                      window.location.reload();
                    }
                  }
                }

                if (noPopup) {
                  doAfter();
                } else {
                  swal({
                    title: title,
                    text: message,
                    type: "success",
                  }).then(function () {
                    doAfter();
                  });
                }
              } else {
                if (title) {
                  title = title;
                } else {
                  title = "An Error Occurred";
                }

                swal(title, message, "error");

                if (stable != "true") {
                  window.setTimeout(function () {}, 2000);
                }
              }
            },
            error: function (data) {
              remove_popup();

              var title = "An error occurred";
              var message = "An error occurred. Please try again later.";
              swal(title, message, "error");
            },
          });
        }, 100);
      }
    });
  });

  $(document).on("click", ".action-button-no-confirm", function (e) {
    e.preventDefault();
    show_loader();

    $this = $(this);
    var id = $this.attr("data-id");
    var url = $this.attr("href");
    var isReload = $this.hasClass("reload");
    var isRedirect = $this.hasClass("redirect");
    var isRemove = $this.hasClass("remove");
    var noPopup = $this.hasClass("no-popup");

    window.setTimeout(function () {
      jQuery.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        data: {
          pk: id,
        },
        success: function (data) {
          var message = data["message"];
          var status = data["status"];
          var redirect = data["redirect"];
          var redirect_url = data["redirect_url"];
          var stable = data["stable"];
          var title = data["title"];

          remove_popup();

          if (status == "true") {
            if (title) {
              title = title;
            } else {
              title = "Success";
            }

            function doAfter() {
              if (isRemove) {
                var row_length = $this.parents("tbody").find("tr").length;
                $this.parents("tr").remove();
                var end = parseInt($(".current_end_status").html());
                var total = parseInt($(".total_count").html());
                $(".total_count").html(total - 1);
                $(".current_end_status").html(end - 1);
                if (row_length <= 1) {
                  window.location.reload();
                }
              }
              if (stable != "true") {
                if (isRedirect && redirect == "true") {
                  window.location.href = redirect_url;
                }
                if (isReload) {
                  window.location.reload();
                }
              }
            }

            if (noPopup) {
              doAfter();
            } else {
              swal({
                title: title,
                text: message,
                type: "success",
              }).then(function () {
                doAfter();
              });
            }
          } else {
            if (title) {
              title = title;
            } else {
              title = "An Error Occurred";
            }

            swal(title, message, "error");

            if (stable != "true") {
              window.setTimeout(function () {}, 2000);
            }
          }
        },
        error: function (data) {
          remove_popup();

          var title = "An error occurred";
          var message = "An error occurred. Please try again later.";
          swal(title, message, "error");
        },
      });
    }, 100);
  });

  $(document).on("submit", "form.ajax", function (e) {
    e.preventDefault();
    var $this = $(this);

    var skip_empty_row = $this.hasClass("skip_empty_row");
    var not_allowed_without_formset = $this.hasClass(
      "not_allowed_without_formset"
    );

    var row_count = $this.find("tr.form_set_row").length;

    if (skip_empty_row) {
      var er = 0;
      $this.find("tr.form_set_row").each(function () {
        $t = $(this);
        var value = $t.find(".check_empty input").val();
        if (!value) {
          if (er == 0) {
            $t.addClass("first");
          }
          er++;
          $t.addClass("delete_row");
        }
      });

      $f = $this.find("tr.form_set_row:first-child");
      if ($f.hasClass("first") && not_allowed_without_formset) {
        $("tr.form_set_row.delete_row").not($f).find("a.icon-trash").click();
      } else {
        $("tr.form_set_row.delete_row").find("a.icon-trash").click();
      }
    }

    $this.validate({
      rules: {
        required_field: "required",
        password1: "required",
        password2: {
          equalTo: "#id_password1",
        },
      },
    });
    var valid = $this.valid();
    if (valid) {
      document.onkeydown = function (evt) {
        return false;
      };

      var url = $this.attr("action");
      var method = $this.attr("method");
      var isReset = $this.hasClass("reset");
      var isReload = $this.hasClass("reload");
      var isRedirect = $this.hasClass("redirect");
      var noLoader = $this.hasClass("no-loader");
      var noPopup = $this.hasClass("no-popup");
      var isRunFunctionAfter = $this.hasClass("run-function-after");
      var function_name = $this.attr("data-function");
      var selector_class = $this.attr(
        "data-after-function-selector-parent-class"
      );
      var $after_selector = "";
      if (selector_class) {
        $after_selector = $("." + selector_class);
      }

      // var data = $this.serialize();
      var formData = new FormData($this[0]);
      if (!noLoader) {
        show_loader();
      }

      jQuery.ajax({
        type: method,
        url: url,
        dataType: "json",
        data: formData,
        processData: false,
        contentType: false,

        success: function (data) {
          if (!noLoader) {
            remove_popup();
          }

          var message = data["message"];
          var status = data["status"];
          var title = data["title"];
          var redirect = data["redirect"];
          var redirect_url = data["redirect_url"];
          var new_redirect_window = data["new_redirect_window"];
          var new_window_url = data["new_window_url"];
          var stable = data["stable"];
          var pk = data["pk"];

          function doAfter() {
            if (isReset) {
              $this[0].reset();
            }

            if (isRunFunctionAfter) {
              doAfterAction(function_name, data, $this, $after_selector);
            }

            if (stable != "true") {
              if (isRedirect && redirect == "true") {
                window.location.href = redirect_url;
              }
              if (isReload) {
                window.location.reload();
              }
            }
          }

          if (status == "true") {
            if (title) {
              title = title;
            } else {
              title = "Success";
            }

            if (new_redirect_window == "true") {
              if (
                new_window_url != "" ||
                new_window_url != null ||
                new_window_url != undefined
              ) {
                window.open(new_window_url);
              }
            }

            if (noPopup) {
              doAfter();
            } else {
              swal({
                title: title,
                text: message,
                type: "success",
              }).then(function () {
                doAfter();
              });
            }
            document.onkeydown = function (evt) {
              return true;
            };
          } else {
            if (title) {
              title = title;
            } else {
              title = "An Error Occurred";
            }

            swal({
              title: title,
              text: message,
              type: "error",
            }).then(function () {
              doAfter();
            });

            if (stable != "true") {
              window.setTimeout(function () {}, 2000);
            }
            document.onkeydown = function (evt) {
              return true;
            };
          }
        },
        error: function (data) {
          remove_popup();

          var title = "An error occurred";
          var message = "An error occurred. Please try again later.";
          document.onkeydown = function (evt) {
            return true;
          };
          swal(title, message, "error");
        },
      });
    }
  });

  $(".endless_page_link").css({
    display: "inline-block",
    padding: "2px 8px",
    background: "#fff",
    "border-radius": "50%",
    color: "#1976D2",
  });
  $(".endless_page_current").css({
    display: "inline-block",
    padding: "2px 8px",
    background: "#1976D2",
    color: "#fff",
    "border-radius": "50%",
  });
});

$(window).resize(function () {
  resize();
});

$(window).on("load", function () {
  resize();
});

//selecty
!(function () {
  "use strict";
  var e = {
      addClass: function (e, t) {
        var i = e.className,
          n = "" !== i ? " " : "",
          s = i + n + t;
        e.className = s;
      },
      removeClass: function (e, t) {
        var i = " " + e.className + " ";
        i = i.replace(/(\s+)/gi, " ");
        var n = i.replace(" " + t + " ", " ");
        (n = n.replace(/(^\s+)|(\s+$)/g, "")), (e.className = n);
      },
      hasClass: function (e, t) {
        var i = e.className,
          n = i.split(/\s+/),
          s = 0;
        for (s in n) if (n[s] == t) return !0;
        return !1;
      },
      addEvent: function (e, t, i) {
        e.addEventListener
          ? e.addEventListener(t, i, !1)
          : e.attachEvent
          ? e.attachEvent("on" + t, i)
          : (e["on" + t] = i);
      },
      removeEvent: function (e, t, i) {
        e.removeEventListener
          ? e.removeEventListener(t, i, !1)
          : e.detachEvent
          ? e.detachEvent("on" + t, i)
          : delete e["on" + t];
      },
      removeElement: function (e) {
        e && e.parentNode && e.parentNode.removeChild(e);
      },
      setUid: function (e) {
        do e += Math.floor(1e6 * Math.random());
        while (document.getElementById(e));
        return e;
      },
      clone: function (t) {
        if ("object" != typeof t) return t;
        if (null === t) return t;
        var i = {};
        for (var n in t) i[n] = e.clone(t[n]);
        return i;
      },
      extend: function () {
        var e = arguments;
        if (!(e.length < 1)) {
          for (var t = this.clone(e[0]), i = 1; i < e.length; i++)
            for (var n in e[i]) t[n] = e[i][n];
          return t;
        }
      },
      eventHandler: function (e) {
        var t = e || window.event,
          i = t.target || t.srcElement;
        return { ev: t, target: i };
      },
      stopPropagation: function (e) {
        e.stopPropagation
          ? e.stopPropagation()
          : window.event && (window.event.cancelBubble = !0);
      },
      getOffset: function (e) {
        var t = e.getBoundingClientRect();
        return {
          top: t.top + window.pageYOffset - document.documentElement.clientTop,
          left:
            t.left + window.pageXOffset - document.documentElement.clientLeft,
        };
      },
    },
    t = function (i, n) {
      return this instanceof t
        ? ((this.settings = e.extend({}, this.defaults, n)),
          (this.el = i),
          (this.multiple = !1),
          (this.selected = []),
          (this.shown = !1),
          (this.disabled = !1),
          (this.ul = null),
          (this.optionLi = []),
          (this.items = null),
          (this.options = null),
          (this.template =
            '<div class="selecty"><a class="selecty-selected"></a><ul class="selecty-options"></ul></div>'),
          void this.init(i))
        : new t(i, n);
    };
  (t.prototype = {
    defaults: { separator: ", " },
    init: function (e) {
      return (
        "string" == typeof e &&
          "#" === e[0] &&
          ((e = document.getElementById(e.substr(1))), (this.el = e)),
        e
          ? e.length < 1
            ? void console.error("No options inside <select>")
            : (null !== this.el.getAttributeNode("multiple") &&
                (this.multiple = !0),
              void ("SELECT" === e.nodeName && this.build()))
          : void console.error("Need select element!")
      );
    },
    build: function () {
      var t =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      if (t) {
        this.el.classList.add("selecty-select");
        var i = document.createElement("div");
        return (
          i.classList.add("selecty-arrow"),
          (i.style.top =
            e.getOffset(this.el).top + this.el.offsetHeight / 2 + "px"),
          (i.style.right = e.getOffset(this.el).left + "px"),
          void this.el.parentNode.insertBefore(i, i.nextSibling)
        );
      }
      (this.el.style.display = "none"),
        (this.options = this.el.querySelectorAll("option")),
        (this.items = this.el.querySelectorAll("option, optgroup")),
        null !== this.el.getAttributeNode("disabled") && (this.disabled = !0);
      var n = document.createElement("div");
      n.innerHTML = this.template;
      var s = n.querySelector(".selecty");
      this.disabled && e.addClass(s, "disabled"),
        (this.btn = n.querySelector(".selecty-selected")),
        (this.ul = n.querySelector(".selecty-options"));
      for (var l = -1, o = !1, r = 0; r < this.items.length; r++) {
        l++;
        var d = document.createElement("li");
        "OPTGROUP" === this.items[r].nodeName
          ? (l--,
            (o = !0),
            (d.innerHTML = this.items[r].getAttribute("label")),
            e.addClass(d, "optgroup"))
          : ((d.innerHTML = this.items[r].innerHTML),
            d.setAttribute("data-value", this.items[r].value),
            d.setAttribute("data-index", l),
            o && e.addClass(d, "optgroup-option"),
            null !== this.items[r].getAttributeNode("selected") &&
              (this.selected.push(l), e.addClass(d, "selected")),
            null !== this.items[r].getAttributeNode("disabled") &&
              e.addClass(d, "disabled")),
          this.ul.appendChild(d);
      }
      (this.optionLi = this.ul.querySelectorAll("li[data-index]")),
        this.updateSelected(),
        this.el.parentNode.insertBefore(n.firstChild, this.el.nextSibling),
        this.events();
    },
    events: function () {
      if (!this.disabled) {
        var t = this;
        e.addEvent(t.btn, "click", function (n) {
          var s = t.otherActived();
          null !== s && e.removeClass(s, "active"),
            e.stopPropagation(n),
            t.show(),
            e.addEvent(document, "click", i);
        }),
          e.addEvent(document, "keydown", function (e) {
            27 == e.which && t.hide();
          });
        var i = function (n) {
          var s = e.eventHandler(n).target,
            l = parseInt(s.getAttribute("data-index")),
            o = e.hasClass(s, "optgroup");
          if (!o)
            if ("LI" === s.nodeName && null !== l) {
              if (e.hasClass(s, "disabled")) return;
              t.multiple
                ? (e.hasClass(s, "selected")
                    ? t.selected.splice(t.selected.indexOf(l), 1)
                    : t.selected.push(l),
                  t.updateSelected())
                : ((t.selected = []),
                  t.selected.push(l),
                  t.updateSelected(),
                  t.hide(),
                  e.removeEvent(document, "click", i));
            } else t.hide(), e.removeEvent(document, "click", i);
        };
      }
    },
    show: function () {
      e.addClass(this.ul, "active"), (this.shown = !0);
    },
    hide: function () {
      e.removeClass(this.ul, "active"),
        e.removeEvent(document.body, "click", function (e) {}),
        (this.shown = !1);
    },
    otherActived: function () {
      for (
        var t = document.body.querySelectorAll(".selecty-options"), i = 0;
        i < t.length;
        i++
      )
        if (e.hasClass(t[i], "active")) return t[i];
      return null;
    },
    updateSelected: function () {
      this.clearSelected(),
        (this.btn.innerHTML = ""),
        this.selected.sort(function (e, t) {
          return e - t;
        });
      for (var t = 0; t < this.selected.length; t++) {
        var i = this.selected[t];
        if (
          (this.options[i].setAttribute("selected", "selected"),
          e.addClass(this.optionLi[i], "selected"),
          this.multiple)
        ) {
          var n = this.settings.separator;
          "" === this.btn.innerHTML && (n = ""),
            (this.btn.innerHTML += n + this.options[i].innerHTML);
        } else this.btn.innerHTML = this.options[i].innerHTML;
      }
      "" === this.btn.innerHTML &&
        (this.btn.innerHTML = this.options[0].innerHTML);
    },
    clearSelected: function () {
      for (var t = 0; t < this.options.length; t++)
        this.options[t].removeAttribute("selected"),
          e.removeClass(this.optionLi[t], "selected");
    },
  }),
    "undefined" != typeof module && module && module.exports
      ? (module.exports = t)
      : "function" == typeof define && define.amd
      ? define([], function () {
          return t;
        })
      : (window.selecty = t);
  var i = window.jQuery;
  void 0 !== i &&
    (i.fn.selecty = function () {
      var e = Array.prototype.slice.call(arguments);
      return i(this).each(function () {
        e[0] && "object" != typeof e[0]
          ? "string" == typeof e[0] &&
            t.prototype[e[0]].apply(new t(this), e.slice(1))
          : new t(this, e[0] || {});
      });
    });
})();

(function (e) {
  e.extend(e.fn, {
    validate: function (t) {
      if (!this.length) {
        if (t && t.debug && window.console) {
          console.warn("Nothing selected, can't validate, returning nothing.");
        }
        return;
      }
      var n = e.data(this[0], "validator");
      if (n) {
        return n;
      }
      this.attr("novalidate", "novalidate");
      n = new e.validator(t, this[0]);
      e.data(this[0], "validator", n);
      if (n.settings.onsubmit) {
        this.validateDelegate(":submit", "click", function (t) {
          if (n.settings.submitHandler) {
            n.submitButton = t.target;
          }
          if (e(t.target).hasClass("cancel")) {
            n.cancelSubmit = true;
          }
          if (e(t.target).attr("formnovalidate") !== undefined) {
            n.cancelSubmit = true;
          }
        });
        this.submit(function (t) {
          function r() {
            var r;
            if (n.settings.submitHandler) {
              if (n.submitButton) {
                r = e("<input type='hidden'/>")
                  .attr("name", n.submitButton.name)
                  .val(e(n.submitButton).val())
                  .appendTo(n.currentForm);
              }
              n.settings.submitHandler.call(n, n.currentForm, t);
              if (n.submitButton) {
                r.remove();
              }
              return false;
            }
            return true;
          }
          if (n.settings.debug) {
            t.preventDefault();
          }
          if (n.cancelSubmit) {
            n.cancelSubmit = false;
            return r();
          }
          if (n.form()) {
            if (n.pendingRequest) {
              n.formSubmitted = true;
              return false;
            }
            return r();
          } else {
            n.focusInvalid();
            return false;
          }
        });
      }
      return n;
    },
    valid: function () {
      if (e(this[0]).is("form")) {
        return this.validate().form();
      } else {
        var t = true;
        var n = e(this[0].form).validate();
        this.each(function () {
          t = t && n.element(this);
        });
        return t;
      }
    },
    removeAttrs: function (t) {
      var n = {},
        r = this;
      e.each(t.split(/\s/), function (e, t) {
        n[t] = r.attr(t);
        r.removeAttr(t);
      });
      return n;
    },
    rules: function (t, n) {
      var r = this[0];
      if (t) {
        var i = e.data(r.form, "validator").settings;
        var s = i.rules;
        var o = e.validator.staticRules(r);
        switch (t) {
          case "add":
            e.extend(o, e.validator.normalizeRule(n));
            delete o.messages;
            s[r.name] = o;
            if (n.messages) {
              i.messages[r.name] = e.extend(i.messages[r.name], n.messages);
            }
            break;
          case "remove":
            if (!n) {
              delete s[r.name];
              return o;
            }
            var u = {};
            e.each(n.split(/\s/), function (e, t) {
              u[t] = o[t];
              delete o[t];
            });
            return u;
        }
      }
      var a = e.validator.normalizeRules(
        e.extend(
          {},
          e.validator.classRules(r),
          e.validator.attributeRules(r),
          e.validator.dataRules(r),
          e.validator.staticRules(r)
        ),
        r
      );
      if (a.required) {
        var f = a.required;
        delete a.required;
        a = e.extend({ required: f }, a);
      }
      return a;
    },
  });
  e.extend(e.expr[":"], {
    blank: function (t) {
      return !e.trim("" + e(t).val());
    },
    filled: function (t) {
      return !!e.trim("" + e(t).val());
    },
    unchecked: function (t) {
      return !e(t).prop("checked");
    },
  });
  e.validator = function (t, n) {
    this.settings = e.extend(true, {}, e.validator.defaults, t);
    this.currentForm = n;
    this.init();
  };
  e.validator.format = function (t, n) {
    if (arguments.length === 1) {
      return function () {
        var n = e.makeArray(arguments);
        n.unshift(t);
        return e.validator.format.apply(this, n);
      };
    }
    if (arguments.length > 2 && n.constructor !== Array) {
      n = e.makeArray(arguments).slice(1);
    }
    if (n.constructor !== Array) {
      n = [n];
    }
    e.each(n, function (e, n) {
      t = t.replace(new RegExp("\\{" + e + "\\}", "g"), function () {
        return n;
      });
    });
    return t;
  };
  e.extend(e.validator, {
    defaults: {
      messages: {},
      groups: {},
      rules: {},
      errorClass: "error",
      validClass: "valid",
      errorElement: "label",
      focusInvalid: true,
      errorContainer: e([]),
      errorLabelContainer: e([]),
      onsubmit: true,
      ignore: ":hidden",
      ignoreTitle: false,
      onfocusin: function (e, t) {
        this.lastActive = e;
        if (this.settings.focusCleanup && !this.blockFocusCleanup) {
          if (this.settings.unhighlight) {
            this.settings.unhighlight.call(
              this,
              e,
              this.settings.errorClass,
              this.settings.validClass
            );
          }
          this.addWrapper(this.errorsFor(e)).hide();
        }
      },
      onfocusout: function (e, t) {
        if (
          !this.checkable(e) &&
          (e.name in this.submitted || !this.optional(e))
        ) {
          this.element(e);
        }
      },
      onkeyup: function (e, t) {
        if (t.which === 9 && this.elementValue(e) === "") {
          return;
        } else if (e.name in this.submitted || e === this.lastElement) {
          this.element(e);
        }
      },
      onclick: function (e, t) {
        if (e.name in this.submitted) {
          this.element(e);
        } else if (e.parentNode.name in this.submitted) {
          this.element(e.parentNode);
        }
      },
      highlight: function (t, n, r) {
        if (t.type === "radio") {
          this.findByName(t.name).addClass(n).removeClass(r);
        } else {
          e(t).addClass(n).removeClass(r);
        }
      },
      unhighlight: function (t, n, r) {
        if (t.type === "radio") {
          this.findByName(t.name).removeClass(n).addClass(r);
        } else {
          e(t).removeClass(n).addClass(r);
        }
      },
    },
    setDefaults: function (t) {
      e.extend(e.validator.defaults, t);
    },
    messages: {
      required: "This field is required.",
      remote: "Please fix this field.",
      email: "Please enter a valid email address.",
      url: "Please enter a valid URL.",
      date: "Please enter a valid date.",
      dateISO: "Please enter a valid date (ISO).",
      number: "Please enter a valid number.",
      digits: "Please enter only digits.",
      creditcard: "Please enter a valid credit card number.",
      equalTo: "Please enter the same value again.",
      maxlength: e.validator.format(
        "Please enter no more than {0} characters."
      ),
      minlength: e.validator.format("Please enter at least {0} characters."),
      rangelength: e.validator.format(
        "Please enter a value between {0} and {1} characters long."
      ),
      range: e.validator.format("Please enter a value between {0} and {1}."),
      max: e.validator.format(
        "Please enter a value less than or equal to {0}."
      ),
      min: e.validator.format(
        "Please enter a value greater than or equal to {0}."
      ),
    },
    autoCreateRanges: false,
    prototype: {
      init: function () {
        function r(t) {
          var n = e.data(this[0].form, "validator"),
            r = "on" + t.type.replace(/^validate/, "");
          if (n.settings[r]) {
            n.settings[r].call(n, this[0], t);
          }
        }
        this.labelContainer = e(this.settings.errorLabelContainer);
        this.errorContext =
          (this.labelContainer.length && this.labelContainer) ||
          e(this.currentForm);
        this.containers = e(this.settings.errorContainer).add(
          this.settings.errorLabelContainer
        );
        this.submitted = {};
        this.valueCache = {};
        this.pendingRequest = 0;
        this.pending = {};
        this.invalid = {};
        this.reset();
        var t = (this.groups = {});
        e.each(this.settings.groups, function (n, r) {
          if (typeof r === "string") {
            r = r.split(/\s/);
          }
          e.each(r, function (e, r) {
            t[r] = n;
          });
        });
        var n = this.settings.rules;
        e.each(n, function (t, r) {
          n[t] = e.validator.normalizeRule(r);
        });
        e(this.currentForm)
          .validateDelegate(
            ":text, [type='password'], [type='file'], select, textarea, " +
              "[type='number'], [type='search'] ,[type='tel'], [type='url'], " +
              "[type='email'], [type='datetime'], [type='date'], [type='month'], " +
              "[type='week'], [type='time'], [type='datetime-local'], " +
              "[type='range'], [type='color'] ",
            "focusin focusout keyup",
            r
          )
          .validateDelegate(
            "[type='radio'], [type='checkbox'], select, option",
            "click",
            r
          );
        if (this.settings.invalidHandler) {
          e(this.currentForm).bind(
            "invalid-form.validate",
            this.settings.invalidHandler
          );
        }
      },
      form: function () {
        this.checkForm();
        e.extend(this.submitted, this.errorMap);
        this.invalid = e.extend({}, this.errorMap);
        if (!this.valid()) {
          e(this.currentForm).triggerHandler("invalid-form", [this]);
        }
        this.showErrors();
        return this.valid();
      },
      checkForm: function () {
        this.prepareForm();
        for (
          var e = 0, t = (this.currentElements = this.elements());
          t[e];
          e++
        ) {
          if (
            this.findByName(t[e].name).length != undefined &&
            this.findByName(t[e].name).length > 1
          ) {
            for (var n = 0; n < this.findByName(t[e].name).length; n++) {
              this.check(this.findByName(t[e].name)[n]);
            }
          } else {
            this.check(t[e]);
          }
        }
        return this.valid();
      },
      element: function (t) {
        t = this.validationTargetFor(this.clean(t));
        this.lastElement = t;
        this.prepareElement(t);
        this.currentElements = e(t);
        var n = this.check(t) !== false;
        if (n) {
          delete this.invalid[t.name];
        } else {
          this.invalid[t.name] = true;
        }
        if (!this.numberOfInvalids()) {
          this.toHide = this.toHide.add(this.containers);
        }
        this.showErrors();
        return n;
      },
      showErrors: function (t) {
        if (t) {
          e.extend(this.errorMap, t);
          this.errorList = [];
          for (var n in t) {
            this.errorList.push({
              message: t[n],
              element: this.findByName(n)[0],
            });
          }
          this.successList = e.grep(this.successList, function (e) {
            return !(e.name in t);
          });
        }
        if (this.settings.showErrors) {
          this.settings.showErrors.call(this, this.errorMap, this.errorList);
        } else {
          this.defaultShowErrors();
        }
      },
      resetForm: function () {
        if (e.fn.resetForm) {
          e(this.currentForm).resetForm();
        }
        this.submitted = {};
        this.lastElement = null;
        this.prepareForm();
        this.hideErrors();
        this.elements()
          .removeClass(this.settings.errorClass)
          .removeData("previousValue");
      },
      numberOfInvalids: function () {
        return this.objectLength(this.invalid);
      },
      objectLength: function (e) {
        var t = 0;
        for (var n in e) {
          t++;
        }
        return t;
      },
      hideErrors: function () {
        this.addWrapper(this.toHide).hide();
      },
      valid: function () {
        return this.size() === 0;
      },
      size: function () {
        return this.errorList.length;
      },
      focusInvalid: function () {
        if (this.settings.focusInvalid) {
          try {
            e(
              this.findLastActive() ||
                (this.errorList.length && this.errorList[0].element) ||
                []
            )
              .filter(":visible")
              .focus()
              .trigger("focusin");
          } catch (t) {}
        }
      },
      findLastActive: function () {
        var t = this.lastActive;
        return (
          t &&
          e.grep(this.errorList, function (e) {
            return e.element.name === t.name;
          }).length === 1 &&
          t
        );
      },
      elements: function () {
        var t = this,
          n = {};
        return e(this.currentForm)
          .find("input, select, textarea")
          .not(":submit, :reset, :image, [disabled]")
          .not(this.settings.ignore)
          .filter(function () {
            if (!this.name && t.settings.debug && window.console) {
              console.error("%o has no name assigned", this);
            }
            if (this.name in n || !t.objectLength(e(this).rules())) {
              return false;
            }
            n[this.name] = true;
            return true;
          });
      },
      clean: function (t) {
        return e(t)[0];
      },
      errors: function () {
        var t = this.settings.errorClass.replace(" ", ".");
        return e(this.settings.errorElement + "." + t, this.errorContext);
      },
      reset: function () {
        this.successList = [];
        this.errorList = [];
        this.errorMap = {};
        this.toShow = e([]);
        this.toHide = e([]);
        this.currentElements = e([]);
      },
      prepareForm: function () {
        this.reset();
        this.toHide = this.errors().add(this.containers);
      },
      prepareElement: function (e) {
        this.reset();
        this.toHide = this.errorsFor(e);
      },
      elementValue: function (t) {
        var n = e(t).attr("type"),
          r = e(t).val();
        if (n === "radio" || n === "checkbox") {
          return e("input[name='" + e(t).attr("name") + "']:checked").val();
        }
        if (typeof r === "string") {
          return r.replace(/\r/g, "");
        }
        return r;
      },
      check: function (t) {
        t = this.validationTargetFor(this.clean(t));
        var n = e(t).rules();
        var r = false;
        var i = this.elementValue(t);
        var s;
        for (var o in n) {
          var u = { method: o, parameters: n[o] };
          try {
            s = e.validator.methods[o].call(this, i, t, u.parameters);
            if (s === "dependency-mismatch") {
              r = true;
              continue;
            }
            r = false;
            if (s === "pending") {
              this.toHide = this.toHide.not(this.errorsFor(t));
              return;
            }
            if (!s) {
              this.formatAndAdd(t, u);
              return false;
            }
          } catch (a) {
            if (this.settings.debug && window.console) {
              console.log(
                "Exception occurred when checking element " +
                  t.id +
                  ", check the '" +
                  u.method +
                  "' method.",
                a
              );
            }
            throw a;
          }
        }
        if (r) {
          return;
        }
        if (this.objectLength(n)) {
          this.successList.push(t);
        }
        return true;
      },
      customDataMessage: function (t, n) {
        return (
          e(t).data("msg-" + n.toLowerCase()) ||
          (t.attributes && e(t).attr("data-msg-" + n.toLowerCase()))
        );
      },
      customMessage: function (e, t) {
        var n = this.settings.messages[e];
        return n && (n.constructor === String ? n : n[t]);
      },
      findDefined: function () {
        for (var e = 0; e < arguments.length; e++) {
          if (arguments[e] !== undefined) {
            return arguments[e];
          }
        }
        return undefined;
      },
      defaultMessage: function (t, n) {
        return this.findDefined(
          this.customMessage(t.name, n),
          this.customDataMessage(t, n),
          (!this.settings.ignoreTitle && t.title) || undefined,
          e.validator.messages[n],
          "<strong>Warning: No message defined for " + t.name + "</strong>"
        );
      },
      formatAndAdd: function (t, n) {
        var r = this.defaultMessage(t, n.method),
          i = /\$?\{(\d+)\}/g;
        if (typeof r === "function") {
          r = r.call(this, n.parameters, t);
        } else if (i.test(r)) {
          r = e.validator.format(r.replace(i, "{$1}"), n.parameters);
        }
        this.errorList.push({ message: r, element: t });
        this.errorMap[t.name] = r;
        this.submitted[t.name] = r;
      },
      addWrapper: function (e) {
        if (this.settings.wrapper) {
          e = e.add(e.parent(this.settings.wrapper));
        }
        return e;
      },
      defaultShowErrors: function () {
        var e, t;
        for (e = 0; this.errorList[e]; e++) {
          var n = this.errorList[e];
          if (this.settings.highlight) {
            this.settings.highlight.call(
              this,
              n.element,
              this.settings.errorClass,
              this.settings.validClass
            );
          }
          this.showLabel(n.element, n.message);
        }
        if (this.errorList.length) {
          this.toShow = this.toShow.add(this.containers);
        }
        if (this.settings.success) {
          for (e = 0; this.successList[e]; e++) {
            this.showLabel(this.successList[e]);
          }
        }
        if (this.settings.unhighlight) {
          for (e = 0, t = this.validElements(); t[e]; e++) {
            this.settings.unhighlight.call(
              this,
              t[e],
              this.settings.errorClass,
              this.settings.validClass
            );
          }
        }
        this.toHide = this.toHide.not(this.toShow);
        this.hideErrors();
        this.addWrapper(this.toShow).show();
      },
      validElements: function () {
        return this.currentElements.not(this.invalidElements());
      },
      invalidElements: function () {
        return e(this.errorList).map(function () {
          return this.element;
        });
      },
      showLabel: function (t, n) {
        var r = this.errorsFor(t);
        if (r.length) {
          r.removeClass(this.settings.validClass).addClass(
            this.settings.errorClass
          );
          r.html(n);
        } else {
          r = e("<" + this.settings.errorElement + ">")
            .attr("for", this.idOrName(t))
            .addClass(this.settings.errorClass)
            .html(n || "");
          if (this.settings.wrapper) {
            r = r
              .hide()
              .show()
              .wrap("<" + this.settings.wrapper + "/>")
              .parent();
          }
          if (!this.labelContainer.append(r).length) {
            if (this.settings.errorPlacement) {
              this.settings.errorPlacement(r, e(t));
            } else {
              r.insertAfter(t);
            }
          }
        }
        if (!n && this.settings.success) {
          r.text("");
          if (typeof this.settings.success === "string") {
            r.addClass(this.settings.success);
          } else {
            this.settings.success(r, t);
          }
        }
        this.toShow = this.toShow.add(r);
      },
      errorsFor: function (t) {
        var n = this.idOrName(t);
        return this.errors().filter(function () {
          return e(this).attr("for") === n;
        });
      },
      idOrName: function (e) {
        return (
          this.groups[e.name] || (this.checkable(e) ? e.name : e.id || e.name)
        );
      },
      validationTargetFor: function (e) {
        if (this.checkable(e)) {
          e = this.findByName(e.name).not(this.settings.ignore)[0];
        }
        return e;
      },
      checkable: function (e) {
        return /radio|checkbox/i.test(e.type);
      },
      findByName: function (t) {
        return e(this.currentForm).find("[name='" + t + "']");
      },
      getLength: function (t, n) {
        switch (n.nodeName.toLowerCase()) {
          case "select":
            return e("option:selected", n).length;
          case "input":
            if (this.checkable(n)) {
              return this.findByName(n.name).filter(":checked").length;
            }
        }
        return t.length;
      },
      depend: function (e, t) {
        return this.dependTypes[typeof e]
          ? this.dependTypes[typeof e](e, t)
          : true;
      },
      dependTypes: {
        boolean: function (e, t) {
          return e;
        },
        string: function (t, n) {
          return !!e(t, n.form).length;
        },
        function: function (e, t) {
          return e(t);
        },
      },
      optional: function (t) {
        var n = this.elementValue(t);
        return (
          !e.validator.methods.required.call(this, n, t) &&
          "dependency-mismatch"
        );
      },
      startRequest: function (e) {
        if (!this.pending[e.name]) {
          this.pendingRequest++;
          this.pending[e.name] = true;
        }
      },
      stopRequest: function (t, n) {
        this.pendingRequest--;
        if (this.pendingRequest < 0) {
          this.pendingRequest = 0;
        }
        delete this.pending[t.name];
        if (
          n &&
          this.pendingRequest === 0 &&
          this.formSubmitted &&
          this.form()
        ) {
          e(this.currentForm).submit();
          this.formSubmitted = false;
        } else if (!n && this.pendingRequest === 0 && this.formSubmitted) {
          e(this.currentForm).triggerHandler("invalid-form", [this]);
          this.formSubmitted = false;
        }
      },
      previousValue: function (t) {
        return (
          e.data(t, "previousValue") ||
          e.data(t, "previousValue", {
            old: null,
            valid: true,
            message: this.defaultMessage(t, "remote"),
          })
        );
      },
    },
    classRuleSettings: {
      required: { required: true },
      email: { email: true },
      url: { url: true },
      date: { date: true },
      dateISO: { dateISO: true },
      number: { number: true },
      digits: { digits: true },
      creditcard: { creditcard: true },
    },
    addClassRules: function (t, n) {
      if (t.constructor === String) {
        this.classRuleSettings[t] = n;
      } else {
        e.extend(this.classRuleSettings, t);
      }
    },
    classRules: function (t) {
      var n = {};
      var r = e(t).attr("class");
      if (r) {
        e.each(r.split(" "), function () {
          if (this in e.validator.classRuleSettings) {
            e.extend(n, e.validator.classRuleSettings[this]);
          }
        });
      }
      return n;
    },
    attributeRules: function (t) {
      var n = {};
      var r = e(t);
      var i = r[0].getAttribute("type");
      for (var s in e.validator.methods) {
        var o;
        if (s === "required") {
          o = r.get(0).getAttribute(s);
          if (o === "") {
            o = true;
          }
          o = !!o;
        } else {
          o = r.attr(s);
        }
        if (/min|max/.test(s) && (i === null || /number|range|text/.test(i))) {
          o = Number(o);
        }
        if (o) {
          n[s] = o;
        } else if (i === s && i !== "range") {
          n[s] = true;
        }
      }
      if (n.maxlength && /-1|2147483647|524288/.test(n.maxlength)) {
        delete n.maxlength;
      }
      return n;
    },
    dataRules: function (t) {
      var n,
        r,
        i = {},
        s = e(t);
      for (n in e.validator.methods) {
        r = s.data("rule-" + n.toLowerCase());
        if (r !== undefined) {
          i[n] = r;
        }
      }
      return i;
    },
    staticRules: function (t) {
      var n = {};
      var r = e.data(t.form, "validator");
      if (r.settings.rules) {
        n = e.validator.normalizeRule(r.settings.rules[t.name]) || {};
      }
      return n;
    },
    normalizeRules: function (t, n) {
      e.each(t, function (r, i) {
        if (i === false) {
          delete t[r];
          return;
        }
        if (i.param || i.depends) {
          var s = true;
          switch (typeof i.depends) {
            case "string":
              s = !!e(i.depends, n.form).length;
              break;
            case "function":
              s = i.depends.call(n, n);
              break;
          }
          if (s) {
            t[r] = i.param !== undefined ? i.param : true;
          } else {
            delete t[r];
          }
        }
      });
      e.each(t, function (r, i) {
        t[r] = e.isFunction(i) ? i(n) : i;
      });
      e.each(["minlength", "maxlength"], function () {
        if (t[this]) {
          t[this] = Number(t[this]);
        }
      });
      e.each(["rangelength", "range"], function () {
        var n;
        if (t[this]) {
          if (e.isArray(t[this])) {
            t[this] = [Number(t[this][0]), Number(t[this][1])];
          } else if (typeof t[this] === "string") {
            n = t[this].split(/[\s,]+/);
            t[this] = [Number(n[0]), Number(n[1])];
          }
        }
      });
      if (e.validator.autoCreateRanges) {
        if (t.min && t.max) {
          t.range = [t.min, t.max];
          delete t.min;
          delete t.max;
        }
        if (t.minlength && t.maxlength) {
          t.rangelength = [t.minlength, t.maxlength];
          delete t.minlength;
          delete t.maxlength;
        }
      }
      return t;
    },
    normalizeRule: function (t) {
      if (typeof t === "string") {
        var n = {};
        e.each(t.split(/\s/), function () {
          n[this] = true;
        });
        t = n;
      }
      return t;
    },
    addMethod: function (t, n, r) {
      e.validator.methods[t] = n;
      e.validator.messages[t] = r !== undefined ? r : e.validator.messages[t];
      if (n.length < 3) {
        e.validator.addClassRules(t, e.validator.normalizeRule(t));
      }
    },
    methods: {
      required: function (t, n, r) {
        if (!this.depend(r, n)) {
          return "dependency-mismatch";
        }
        if (n.nodeName.toLowerCase() === "select") {
          var i = e(n).val();
          return i && i.length > 0;
        }
        if (this.checkable(n)) {
          return this.getLength(t, n) > 0;
        }
        return e.trim(t).length > 0;
      },
      email: function (e, t) {
        return (
          this.optional(t) ||
          /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(
            e
          )
        );
      },
      url: function (e, t) {
        return (
          this.optional(t) ||
          /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(
            e
          )
        );
      },
      date: function (e, t) {
        return this.optional(t) || !/Invalid|NaN/.test(new Date(e).toString());
      },
      dateISO: function (e, t) {
        return this.optional(t) || /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(e);
      },
      number: function (e, t) {
        return (
          this.optional(t) ||
          /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(e)
        );
      },
      digits: function (e, t) {
        return this.optional(t) || /^\d+$/.test(e);
      },
      creditcard: function (e, t) {
        if (this.optional(t)) {
          return "dependency-mismatch";
        }
        if (/[^0-9 \-]+/.test(e)) {
          return false;
        }
        var n = 0,
          r = 0,
          i = false;
        e = e.replace(/\D/g, "");
        for (var s = e.length - 1; s >= 0; s--) {
          var o = e.charAt(s);
          r = parseInt(o, 10);
          if (i) {
            if ((r *= 2) > 9) {
              r -= 9;
            }
          }
          n += r;
          i = !i;
        }
        return n % 10 === 0;
      },
      minlength: function (t, n, r) {
        var i = e.isArray(t) ? t.length : this.getLength(e.trim(t), n);
        return this.optional(n) || i >= r;
      },
      maxlength: function (t, n, r) {
        var i = e.isArray(t) ? t.length : this.getLength(e.trim(t), n);
        return this.optional(n) || i <= r;
      },
      rangelength: function (t, n, r) {
        var i = e.isArray(t) ? t.length : this.getLength(e.trim(t), n);
        return this.optional(n) || (i >= r[0] && i <= r[1]);
      },
      min: function (e, t, n) {
        return this.optional(t) || e >= n;
      },
      max: function (e, t, n) {
        return this.optional(t) || e <= n;
      },
      range: function (e, t, n) {
        return this.optional(t) || (e >= n[0] && e <= n[1]);
      },
      equalTo: function (t, n, r) {
        var i = e(r);
        if (this.settings.onfocusout) {
          i.unbind(".validate-equalTo").bind(
            "blur.validate-equalTo",
            function () {
              e(n).valid();
            }
          );
        }
        return t === i.val();
      },
      remote: function (t, n, r) {
        if (this.optional(n)) {
          return "dependency-mismatch";
        }
        var i = this.previousValue(n);
        if (!this.settings.messages[n.name]) {
          this.settings.messages[n.name] = {};
        }
        i.originalMessage = this.settings.messages[n.name].remote;
        this.settings.messages[n.name].remote = i.message;
        r = (typeof r === "string" && { url: r }) || r;
        if (i.old === t) {
          return i.valid;
        }
        i.old = t;
        var s = this;
        this.startRequest(n);
        var o = {};
        o[n.name] = t;
        e.ajax(
          e.extend(
            true,
            {
              url: r,
              mode: "abort",
              port: "validate" + n.name,
              dataType: "json",
              data: o,
              success: function (r) {
                s.settings.messages[n.name].remote = i.originalMessage;
                var o = r === true || r === "true";
                if (o) {
                  var u = s.formSubmitted;
                  s.prepareElement(n);
                  s.formSubmitted = u;
                  s.successList.push(n);
                  delete s.invalid[n.name];
                  s.showErrors();
                } else {
                  var a = {};
                  var f = r || s.defaultMessage(n, "remote");
                  a[n.name] = i.message = e.isFunction(f) ? f(t) : f;
                  s.invalid[n.name] = true;
                  s.showErrors(a);
                }
                i.valid = o;
                s.stopRequest(n, o);
              },
            },
            r
          )
        );
        return "pending";
      },
    },
  });
  e.format = e.validator.format;
})(jQuery);
(function (e) {
  var t = {};
  if (e.ajaxPrefilter) {
    e.ajaxPrefilter(function (e, n, r) {
      var i = e.port;
      if (e.mode === "abort") {
        if (t[i]) {
          t[i].abort();
        }
        t[i] = r;
      }
    });
  } else {
    var n = e.ajax;
    e.ajax = function (r) {
      var i = ("mode" in r ? r : e.ajaxSettings).mode,
        s = ("port" in r ? r : e.ajaxSettings).port;
      if (i === "abort") {
        if (t[s]) {
          t[s].abort();
        }
        t[s] = n.apply(this, arguments);
        return t[s];
      }
      return n.apply(this, arguments);
    };
  }
})(jQuery);
(function (e) {
  e.extend(e.fn, {
    validateDelegate: function (t, n, r) {
      return this.bind(n, function (n) {
        var i = e(n.target);
        if (i.is(t)) {
          return r.apply(i, arguments);
        }
      });
    },
  });
})(jQuery);
/* form validation*/

/* sweet alert */
!(function (e, t) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = t())
    : "function" == typeof define && define.amd
    ? define(t)
    : (e.Sweetalert2 = t());
})(this, function () {
  "use strict";
  var e = {
      title: "",
      titleText: "",
      text: "",
      html: "",
      type: null,
      customClass: "",
      target: "body",
      animation: !0,
      allowOutsideClick: !0,
      allowEscapeKey: !0,
      allowEnterKey: !0,
      showConfirmButton: !0,
      showCancelButton: !1,
      preConfirm: null,
      confirmButtonText: "OK",
      confirmButtonColor: "#3085d6",
      confirmButtonClass: null,
      cancelButtonText: "Cancel",
      cancelButtonColor: "#aaa",
      cancelButtonClass: null,
      buttonsStyling: !0,
      reverseButtons: !1,
      focusCancel: !1,
      showCloseButton: !1,
      showLoaderOnConfirm: !1,
      imageUrl: null,
      imageWidth: null,
      imageHeight: null,
      imageClass: null,
      timer: null,
      width: 500,
      padding: 20,
      background: "#fff",
      input: null,
      inputPlaceholder: "",
      inputValue: "",
      inputOptions: {},
      inputAutoTrim: !0,
      inputClass: null,
      inputAttributes: {},
      inputValidator: null,
      progressSteps: [],
      currentProgressStep: null,
      progressStepsDistance: "40px",
      onOpen: null,
      onClose: null,
      useRejections: !0,
    },
    t = function (e) {
      var t = {};
      for (var n in e) t[e[n]] = "swal2-" + e[n];
      return t;
    },
    n = t([
      "container",
      "shown",
      "iosfix",
      "modal",
      "overlay",
      "fade",
      "show",
      "hide",
      "noanimation",
      "close",
      "title",
      "content",
      "buttonswrapper",
      "confirm",
      "cancel",
      "icon",
      "image",
      "input",
      "file",
      "range",
      "select",
      "radio",
      "checkbox",
      "textarea",
      "inputerror",
      "validationerror",
      "progresssteps",
      "activeprogressstep",
      "progresscircle",
      "progressline",
      "loading",
      "styled",
    ]),
    o = t(["success", "warning", "info", "question", "error"]),
    r = function (e, t) {
      (e = String(e).replace(/[^0-9a-f]/gi, "")).length < 6 &&
        (e = e[0] + e[0] + e[1] + e[1] + e[2] + e[2]),
        (t = t || 0);
      for (var n = "#", o = 0; o < 3; o++) {
        var r = parseInt(e.substr(2 * o, 2), 16);
        n += (
          "00" +
          (r = Math.round(Math.min(Math.max(0, r + r * t), 255)).toString(16))
        ).substr(r.length);
      }
      return n;
    },
    i = function (e) {
      var t = [];
      for (var n in e) -1 === t.indexOf(e[n]) && t.push(e[n]);
      return t;
    },
    a = {
      previousWindowKeyDown: null,
      previousActiveElement: null,
      previousBodyPadding: null,
    },
    l = function (e) {
      if ("undefined" != typeof document) {
        var t = document.createElement("div");
        (t.className = n.container), (t.innerHTML = s);
        var o = document.querySelector(e.target);
        o ||
          (console.warn(
            "SweetAlert2: Can't find the target \"" + e.target + '"'
          ),
          (o = document.body)),
          o.appendChild(t);
        var r = c(),
          i = A(r, n.input),
          a = A(r, n.file),
          l = r.querySelector("." + n.range + " input"),
          u = r.querySelector("." + n.range + " output"),
          d = A(r, n.select),
          p = r.querySelector("." + n.checkbox + " input"),
          f = A(r, n.textarea);
        return (
          (i.oninput = function () {
            $.resetValidationError();
          }),
          (i.onkeydown = function (t) {
            setTimeout(function () {
              13 === t.keyCode &&
                e.allowEnterKey &&
                (t.stopPropagation(), $.clickConfirm());
            }, 0);
          }),
          (a.onchange = function () {
            $.resetValidationError();
          }),
          (l.oninput = function () {
            $.resetValidationError(), (u.value = l.value);
          }),
          (l.onchange = function () {
            $.resetValidationError(), (l.previousSibling.value = l.value);
          }),
          (d.onchange = function () {
            $.resetValidationError();
          }),
          (p.onchange = function () {
            $.resetValidationError();
          }),
          (f.oninput = function () {
            $.resetValidationError();
          }),
          r
        );
      }
      console.error("SweetAlert2 requires document to initialize");
    },
    s = (
      '\n <div role="dialog" aria-labelledby="' +
      n.title +
      '" aria-describedby="' +
      n.content +
      '" class="' +
      n.modal +
      '" tabindex="-1">\n   <ul class="' +
      n.progresssteps +
      '"></ul>\n   <div class="' +
      n.icon +
      " " +
      o.error +
      '">\n     <span class="swal2-x-mark"><span class="swal2-x-mark-line-left"></span><span class="swal2-x-mark-line-right"></span></span>\n   </div>\n   <div class="' +
      n.icon +
      " " +
      o.question +
      '">?</div>\n   <div class="' +
      n.icon +
      " " +
      o.warning +
      '">!</div>\n   <div class="' +
      n.icon +
      " " +
      o.info +
      '">i</div>\n   <div class="' +
      n.icon +
      " " +
      o.success +
      '">\n     <div class="swal2-success-circular-line-left"></div>\n     <span class="swal2-success-line-tip"></span> <span class="swal2-success-line-long"></span>\n     <div class="swal2-success-ring"></div> <div class="swal2-success-fix"></div>\n     <div class="swal2-success-circular-line-right"></div>\n   </div>\n   <img class="' +
      n.image +
      '" />\n   <h2 class="' +
      n.title +
      '" id="' +
      n.title +
      '"></h2>\n   <div id="' +
      n.content +
      '" class="' +
      n.content +
      '"></div>\n   <input class="' +
      n.input +
      '" />\n   <input type="file" class="' +
      n.file +
      '" />\n   <div class="' +
      n.range +
      '">\n     <output></output>\n     <input type="range" />\n   </div>\n   <select class="' +
      n.select +
      '"></select>\n   <div class="' +
      n.radio +
      '"></div>\n   <label for="' +
      n.checkbox +
      '" class="' +
      n.checkbox +
      '">\n     <input type="checkbox" />\n   </label>\n   <textarea class="' +
      n.textarea +
      '"></textarea>\n   <div class="' +
      n.validationerror +
      '"></div>\n   <div class="' +
      n.buttonswrapper +
      '">\n     <button type="button" class="' +
      n.confirm +
      '">OK</button>\n     <button type="button" class="' +
      n.cancel +
      '">Cancel</button>\n   </div>\n   <button type="button" class="' +
      n.close +
      '" aria-label="Close this dialog">Ã—</button>\n </div>\n'
    ).replace(/(^|\n)\s*/g, ""),
    u = function () {
      return document.body.querySelector("." + n.container);
    },
    c = function () {
      return u() ? u().querySelector("." + n.modal) : null;
    },
    d = function () {
      return c().querySelectorAll("." + n.icon);
    },
    p = function (e) {
      return u() ? u().querySelector("." + e) : null;
    },
    f = function () {
      return p(n.title);
    },
    m = function () {
      return p(n.content);
    },
    v = function () {
      return p(n.image);
    },
    h = function () {
      return p(n.buttonswrapper);
    },
    g = function () {
      return p(n.progresssteps);
    },
    y = function () {
      return p(n.validationerror);
    },
    b = function () {
      return p(n.confirm);
    },
    w = function () {
      return p(n.cancel);
    },
    C = function () {
      return p(n.close);
    },
    k = function (e) {
      var t = [b(), w()];
      e && t.reverse();
      var n = t.concat(
        Array.prototype.slice.call(
          c().querySelectorAll(
            'button, input:not([type=hidden]), textarea, select, a, *[tabindex]:not([tabindex="-1"])'
          )
        )
      );
      return i(n);
    },
    x = function (e, t) {
      return !!e.classList && e.classList.contains(t);
    },
    S = function (e) {
      if ((e.focus(), "file" !== e.type)) {
        var t = e.value;
        (e.value = ""), (e.value = t);
      }
    },
    E = function (e, t) {
      e &&
        t &&
        t
          .split(/\s+/)
          .filter(Boolean)
          .forEach(function (t) {
            e.classList.add(t);
          });
    },
    B = function (e, t) {
      e &&
        t &&
        t
          .split(/\s+/)
          .filter(Boolean)
          .forEach(function (t) {
            e.classList.remove(t);
          });
    },
    A = function (e, t) {
      for (var n = 0; n < e.childNodes.length; n++)
        if (x(e.childNodes[n], t)) return e.childNodes[n];
    },
    P = function (e, t) {
      t || (t = "block"), (e.style.opacity = ""), (e.style.display = t);
    },
    T = function (e) {
      (e.style.opacity = ""), (e.style.display = "none");
    },
    L = function (e) {
      for (; e.firstChild; ) e.removeChild(e.firstChild);
    },
    M = function (e) {
      return e.offsetWidth || e.offsetHeight || e.getClientRects().length;
    },
    q = function (e, t) {
      e.style.removeProperty
        ? e.style.removeProperty(t)
        : e.style.removeAttribute(t);
    },
    V = function (e) {
      if (!M(e)) return !1;
      if ("function" == typeof MouseEvent) {
        var t = new MouseEvent("click", {
          view: window,
          bubbles: !1,
          cancelable: !0,
        });
        e.dispatchEvent(t);
      } else if (document.createEvent) {
        var n = document.createEvent("MouseEvents");
        n.initEvent("click", !1, !1), e.dispatchEvent(n);
      } else
        document.createEventObject
          ? e.fireEvent("onclick")
          : "function" == typeof e.onclick && e.onclick();
    },
    O = (function () {
      var e = document.createElement("div"),
        t = {
          WebkitAnimation: "webkitAnimationEnd",
          OAnimation: "oAnimationEnd oanimationend",
          msAnimation: "MSAnimationEnd",
          animation: "animationend",
        };
      for (var n in t)
        if (t.hasOwnProperty(n) && void 0 !== e.style[n]) return t[n];
      return !1;
    })(),
    H = function () {
      if (
        ((window.onkeydown = a.previousWindowKeyDown),
        a.previousActiveElement && a.previousActiveElement.focus)
      ) {
        var e = window.scrollX,
          t = window.scrollY;
        a.previousActiveElement.focus(), e && t && window.scrollTo(e, t);
      }
    },
    N = function () {
      if ("ontouchstart" in window || navigator.msMaxTouchPoints) return 0;
      var e = document.createElement("div");
      (e.style.width = "50px"),
        (e.style.height = "50px"),
        (e.style.overflow = "scroll"),
        document.body.appendChild(e);
      var t = e.offsetWidth - e.clientWidth;
      return document.body.removeChild(e), t;
    },
    j = function (e, t) {
      var n = void 0;
      return function () {
        clearTimeout(n),
          (n = setTimeout(function () {
            (n = null), e();
          }, t));
      };
    },
    R =
      "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
        ? function (e) {
            return typeof e;
          }
        : function (e) {
            return e &&
              "function" == typeof Symbol &&
              e.constructor === Symbol &&
              e !== Symbol.prototype
              ? "symbol"
              : typeof e;
          },
    I =
      Object.assign ||
      function (e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = arguments[t];
          for (var o in n)
            Object.prototype.hasOwnProperty.call(n, o) && (e[o] = n[o]);
        }
        return e;
      },
    K = I({}, e),
    D = [],
    W = void 0,
    U = function (t) {
      var r = c() || l(t);
      for (var i in t)
        e.hasOwnProperty(i) ||
          "extraParams" === i ||
          console.warn('SweetAlert2: Unknown parameter "' + i + '"');
      (r.style.width = "number" == typeof t.width ? t.width + "px" : t.width),
        (r.style.padding = t.padding + "px"),
        (r.style.background = t.background);
      for (
        var a = r.querySelectorAll(
            "[class^=swal2-success-circular-line], .swal2-success-fix"
          ),
          s = 0;
        s < a.length;
        s++
      )
        a[s].style.background = t.background;
      var u = f(),
        p = m(),
        y = h(),
        k = b(),
        x = w(),
        S = C();
      if (
        (t.titleText
          ? (u.innerText = t.titleText)
          : (u.innerHTML = t.title.split("\n").join("<br />")),
        t.text || t.html)
      ) {
        if ("object" === R(t.html))
          if (((p.innerHTML = ""), 0 in t.html))
            for (var A = 0; A in t.html; A++)
              p.appendChild(t.html[A].cloneNode(!0));
          else p.appendChild(t.html.cloneNode(!0));
        else
          t.html ? (p.innerHTML = t.html) : t.text && (p.textContent = t.text);
        P(p);
      } else T(p);
      t.showCloseButton ? P(S) : T(S),
        (r.className = n.modal),
        t.customClass && E(r, t.customClass);
      var M = g(),
        V = parseInt(
          null === t.currentProgressStep
            ? $.getQueueStep()
            : t.currentProgressStep,
          10
        );
      t.progressSteps.length
        ? (P(M),
          L(M),
          V >= t.progressSteps.length &&
            console.warn(
              "SweetAlert2: Invalid currentProgressStep parameter, it should be less than progressSteps.length (currentProgressStep like JS arrays starts from 0)"
            ),
          t.progressSteps.forEach(function (e, o) {
            var r = document.createElement("li");
            if (
              (E(r, n.progresscircle),
              (r.innerHTML = e),
              o === V && E(r, n.activeprogressstep),
              M.appendChild(r),
              o !== t.progressSteps.length - 1)
            ) {
              var i = document.createElement("li");
              E(i, n.progressline),
                (i.style.width = t.progressStepsDistance),
                M.appendChild(i);
            }
          }))
        : T(M);
      for (var O = d(), H = 0; H < O.length; H++) T(O[H]);
      if (t.type) {
        var N = !1;
        for (var j in o)
          if (t.type === j) {
            N = !0;
            break;
          }
        if (!N)
          return (
            console.error("SweetAlert2: Unknown alert type: " + t.type), !1
          );
        var I = r.querySelector("." + n.icon + "." + o[t.type]);
        if ((P(I), t.animation))
          switch (t.type) {
            case "success":
              E(I, "swal2-animate-success-icon"),
                E(
                  I.querySelector(".swal2-success-line-tip"),
                  "swal2-animate-success-line-tip"
                ),
                E(
                  I.querySelector(".swal2-success-line-long"),
                  "swal2-animate-success-line-long"
                );
              break;
            case "error":
              E(I, "swal2-animate-error-icon"),
                E(I.querySelector(".swal2-x-mark"), "swal2-animate-x-mark");
          }
      }
      var K = v();
      t.imageUrl
        ? (K.setAttribute("src", t.imageUrl),
          P(K),
          t.imageWidth
            ? K.setAttribute("width", t.imageWidth)
            : K.removeAttribute("width"),
          t.imageHeight
            ? K.setAttribute("height", t.imageHeight)
            : K.removeAttribute("height"),
          (K.className = n.image),
          t.imageClass && E(K, t.imageClass))
        : T(K),
        t.showCancelButton ? (x.style.display = "inline-block") : T(x),
        t.showConfirmButton ? q(k, "display") : T(k),
        t.showConfirmButton || t.showCancelButton ? P(y) : T(y),
        (k.innerHTML = t.confirmButtonText),
        (x.innerHTML = t.cancelButtonText),
        t.buttonsStyling &&
          ((k.style.backgroundColor = t.confirmButtonColor),
          (x.style.backgroundColor = t.cancelButtonColor)),
        (k.className = n.confirm),
        E(k, t.confirmButtonClass),
        (x.className = n.cancel),
        E(x, t.cancelButtonClass),
        t.buttonsStyling
          ? (E(k, n.styled), E(x, n.styled))
          : (B(k, n.styled),
            B(x, n.styled),
            (k.style.backgroundColor =
              k.style.borderLeftColor =
              k.style.borderRightColor =
                ""),
            (x.style.backgroundColor =
              x.style.borderLeftColor =
              x.style.borderRightColor =
                "")),
        !0 === t.animation ? B(r, n.noanimation) : E(r, n.noanimation);
    },
    z = function (e, t) {
      var o = u(),
        r = c();
      e ? (E(r, n.show), E(o, n.fade), B(r, n.hide)) : B(r, n.fade),
        P(r),
        (o.style.overflowY = "hidden"),
        O && !x(r, n.noanimation)
          ? r.addEventListener(O, function e() {
              r.removeEventListener(O, e), (o.style.overflowY = "auto");
            })
          : (o.style.overflowY = "auto"),
        E(document.documentElement, n.shown),
        E(document.body, n.shown),
        E(o, n.shown),
        Z(),
        Y(),
        (a.previousActiveElement = document.activeElement),
        null !== t &&
          "function" == typeof t &&
          setTimeout(function () {
            t(r);
          });
    },
    Z = function () {
      null === a.previousBodyPadding &&
        document.body.scrollHeight > window.innerHeight &&
        ((a.previousBodyPadding = document.body.style.paddingRight),
        (document.body.style.paddingRight = N() + "px"));
    },
    Q = function () {
      null !== a.previousBodyPadding &&
        ((document.body.style.paddingRight = a.previousBodyPadding),
        (a.previousBodyPadding = null));
    },
    Y = function () {
      if (
        /iPad|iPhone|iPod/.test(navigator.userAgent) &&
        !window.MSStream &&
        !x(document.body, n.iosfix)
      ) {
        var e = document.body.scrollTop;
        (document.body.style.top = -1 * e + "px"), E(document.body, n.iosfix);
      }
    },
    _ = function () {
      if (x(document.body, n.iosfix)) {
        var e = parseInt(document.body.style.top, 10);
        B(document.body, n.iosfix),
          (document.body.style.top = ""),
          (document.body.scrollTop = -1 * e);
      }
    },
    $ = function e() {
      for (var t = arguments.length, o = Array(t), i = 0; i < t; i++)
        o[i] = arguments[i];
      if (void 0 === o[0])
        return console.error("SweetAlert2 expects at least 1 attribute!"), !1;
      var l = I({}, K);
      switch (R(o[0])) {
        case "string":
          (l.title = o[0]), (l.html = o[1]), (l.type = o[2]);
          break;
        case "object":
          I(l, o[0]),
            (l.extraParams = o[0].extraParams),
            "email" === l.input &&
              null === l.inputValidator &&
              (l.inputValidator = function (e) {
                return new Promise(function (t, n) {
                  /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(e)
                    ? t()
                    : n("Invalid email address");
                });
              }),
            "url" === l.input &&
              null === l.inputValidator &&
              (l.inputValidator = function (e) {
                return new Promise(function (t, n) {
                  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/.test(
                    e
                  )
                    ? t()
                    : n("Invalid URL");
                });
              });
          break;
        default:
          return (
            console.error(
              'SweetAlert2: Unexpected type of argument! Expected "string" or "object", got ' +
                R(o[0])
            ),
            !1
          );
      }
      U(l);
      var s = u(),
        d = c();
      return new Promise(function (t, o) {
        l.timer &&
          (d.timeout = setTimeout(function () {
            e.closeModal(l.onClose),
              l.useRejections ? o("timer") : t({ dismiss: "timer" });
          }, l.timer));
        var i = function (e) {
            if (!(e = e || l.input)) return null;
            switch (e) {
              case "select":
              case "textarea":
              case "file":
                return A(d, n[e]);
              case "checkbox":
                return d.querySelector("." + n.checkbox + " input");
              case "radio":
                return (
                  d.querySelector("." + n.radio + " input:checked") ||
                  d.querySelector("." + n.radio + " input:first-child")
                );
              case "range":
                return d.querySelector("." + n.range + " input");
              default:
                return A(d, n.input);
            }
          },
          p = function () {
            var e = i();
            if (!e) return null;
            switch (l.input) {
              case "checkbox":
                return e.checked ? 1 : 0;
              case "radio":
                return e.checked ? e.value : null;
              case "file":
                return e.files.length ? e.files[0] : null;
              default:
                return l.inputAutoTrim ? e.value.trim() : e.value;
            }
          };
        l.input &&
          setTimeout(function () {
            var e = i();
            e && S(e);
          }, 0);
        for (
          var x = function (n) {
              l.showLoaderOnConfirm && e.showLoading(),
                l.preConfirm
                  ? l.preConfirm(n, l.extraParams).then(
                      function (o) {
                        e.closeModal(l.onClose), t(o || n);
                      },
                      function (t) {
                        e.hideLoading(), t && e.showValidationError(t);
                      }
                    )
                  : (e.closeModal(l.onClose),
                    t(l.useRejections ? n : { value: n }));
            },
            L = function (n) {
              var i = n || window.event,
                a = i.target || i.srcElement,
                s = b(),
                u = w(),
                c = s && (s === a || s.contains(a)),
                d = u && (u === a || u.contains(a));
              switch (i.type) {
                case "mouseover":
                case "mouseup":
                  l.buttonsStyling &&
                    (c
                      ? (s.style.backgroundColor = r(
                          l.confirmButtonColor,
                          -0.1
                        ))
                      : d &&
                        (u.style.backgroundColor = r(
                          l.cancelButtonColor,
                          -0.1
                        )));
                  break;
                case "mouseout":
                  l.buttonsStyling &&
                    (c
                      ? (s.style.backgroundColor = l.confirmButtonColor)
                      : d && (u.style.backgroundColor = l.cancelButtonColor));
                  break;
                case "mousedown":
                  l.buttonsStyling &&
                    (c
                      ? (s.style.backgroundColor = r(
                          l.confirmButtonColor,
                          -0.2
                        ))
                      : d &&
                        (u.style.backgroundColor = r(
                          l.cancelButtonColor,
                          -0.2
                        )));
                  break;
                case "click":
                  if (c && e.isVisible())
                    if ((e.disableButtons(), l.input)) {
                      var f = p();
                      l.inputValidator
                        ? (e.disableInput(),
                          l.inputValidator(f, l.extraParams).then(
                            function () {
                              e.enableButtons(), e.enableInput(), x(f);
                            },
                            function (t) {
                              e.enableButtons(),
                                e.enableInput(),
                                t && e.showValidationError(t);
                            }
                          ))
                        : x(f);
                    } else x(!0);
                  else
                    d &&
                      e.isVisible() &&
                      (e.disableButtons(),
                      e.closeModal(l.onClose),
                      l.useRejections ? o("cancel") : t({ dismiss: "cancel" }));
              }
            },
            q = d.querySelectorAll("button"),
            O = 0;
          O < q.length;
          O++
        )
          (q[O].onclick = L),
            (q[O].onmouseover = L),
            (q[O].onmouseout = L),
            (q[O].onmousedown = L);
        (C().onclick = function () {
          e.closeModal(l.onClose),
            l.useRejections ? o("close") : t({ dismiss: "close" });
        }),
          (s.onclick = function (n) {
            n.target === s &&
              l.allowOutsideClick &&
              (e.closeModal(l.onClose),
              l.useRejections ? o("overlay") : t({ dismiss: "overlay" }));
          });
        var H = h(),
          N = b(),
          I = w();
        l.reverseButtons
          ? N.parentNode.insertBefore(I, N)
          : N.parentNode.insertBefore(N, I);
        var K = function (e, t) {
            for (var n = k(l.focusCancel), o = 0; o < n.length; o++) {
              (e += t) === n.length ? (e = 0) : -1 === e && (e = n.length - 1);
              var r = n[e];
              if (M(r)) return r.focus();
            }
          },
          D = function (n) {
            var r = n || window.event,
              i = r.keyCode || r.which;
            if (-1 !== [9, 13, 32, 27, 37, 38, 39, 40].indexOf(i)) {
              for (
                var a = r.target || r.srcElement,
                  s = k(l.focusCancel),
                  u = -1,
                  c = 0;
                c < s.length;
                c++
              )
                if (a === s[c]) {
                  u = c;
                  break;
                }
              9 === i
                ? (r.shiftKey ? K(u, -1) : K(u, 1),
                  r.stopPropagation(),
                  r.preventDefault())
                : 37 === i || 38 === i || 39 === i || 40 === i
                ? document.activeElement === N && M(I)
                  ? I.focus()
                  : document.activeElement === I && M(N) && N.focus()
                : 13 === i || 32 === i
                ? -1 === u &&
                  l.allowEnterKey &&
                  (V(l.focusCancel ? I : N),
                  r.stopPropagation(),
                  r.preventDefault())
                : 27 === i &&
                  !0 === l.allowEscapeKey &&
                  (e.closeModal(l.onClose),
                  l.useRejections ? o("esc") : t({ dismiss: "esc" }));
            }
          };
        (window.onkeydown && window.onkeydown.toString() === D.toString()) ||
          ((a.previousWindowKeyDown = window.onkeydown),
          (window.onkeydown = D)),
          l.buttonsStyling &&
            ((N.style.borderLeftColor = l.confirmButtonColor),
            (N.style.borderRightColor = l.confirmButtonColor)),
          (e.hideLoading = e.disableLoading =
            function () {
              l.showConfirmButton || (T(N), l.showCancelButton || T(h())),
                B(H, n.loading),
                B(d, n.loading),
                (N.disabled = !1),
                (I.disabled = !1);
            }),
          (e.getTitle = function () {
            return f();
          }),
          (e.getContent = function () {
            return m();
          }),
          (e.getInput = function () {
            return i();
          }),
          (e.getImage = function () {
            return v();
          }),
          (e.getButtonsWrapper = function () {
            return h();
          }),
          (e.getConfirmButton = function () {
            return b();
          }),
          (e.getCancelButton = function () {
            return w();
          }),
          (e.enableButtons = function () {
            (N.disabled = !1), (I.disabled = !1);
          }),
          (e.disableButtons = function () {
            (N.disabled = !0), (I.disabled = !0);
          }),
          (e.enableConfirmButton = function () {
            N.disabled = !1;
          }),
          (e.disableConfirmButton = function () {
            N.disabled = !0;
          }),
          (e.enableInput = function () {
            var e = i();
            if (!e) return !1;
            if ("radio" === e.type)
              for (
                var t = e.parentNode.parentNode.querySelectorAll("input"),
                  n = 0;
                n < t.length;
                n++
              )
                t[n].disabled = !1;
            else e.disabled = !1;
          }),
          (e.disableInput = function () {
            var e = i();
            if (!e) return !1;
            if (e && "radio" === e.type)
              for (
                var t = e.parentNode.parentNode.querySelectorAll("input"),
                  n = 0;
                n < t.length;
                n++
              )
                t[n].disabled = !0;
            else e.disabled = !0;
          }),
          (e.recalculateHeight = j(function () {
            var e = c();
            if (e) {
              var t = e.style.display;
              (e.style.minHeight = ""),
                P(e),
                (e.style.minHeight = e.scrollHeight + 1 + "px"),
                (e.style.display = t);
            }
          }, 50)),
          (e.showValidationError = function (e) {
            var t = y();
            (t.innerHTML = e), P(t);
            var o = i();
            o && (S(o), E(o, n.inputerror));
          }),
          (e.resetValidationError = function () {
            var t = y();
            T(t), e.recalculateHeight();
            var o = i();
            o && B(o, n.inputerror);
          }),
          (e.getProgressSteps = function () {
            return l.progressSteps;
          }),
          (e.setProgressSteps = function (e) {
            (l.progressSteps = e), U(l);
          }),
          (e.showProgressSteps = function () {
            P(g());
          }),
          (e.hideProgressSteps = function () {
            T(g());
          }),
          e.enableButtons(),
          e.hideLoading(),
          e.resetValidationError();
        for (
          var Z = [
              "input",
              "file",
              "range",
              "select",
              "radio",
              "checkbox",
              "textarea",
            ],
            Q = void 0,
            Y = 0;
          Y < Z.length;
          Y++
        ) {
          var _ = n[Z[Y]],
            $ = A(d, _);
          if ((Q = i(Z[Y]))) {
            for (var J in Q.attributes)
              if (Q.attributes.hasOwnProperty(J)) {
                var X = Q.attributes[J].name;
                "type" !== X && "value" !== X && Q.removeAttribute(X);
              }
            for (var F in l.inputAttributes)
              Q.setAttribute(F, l.inputAttributes[F]);
          }
          ($.className = _), l.inputClass && E($, l.inputClass), T($);
        }
        var G = void 0;
        switch (l.input) {
          case "text":
          case "email":
          case "password":
          case "number":
          case "tel":
          case "url":
            ((Q = A(d, n.input)).value = l.inputValue),
              (Q.placeholder = l.inputPlaceholder),
              (Q.type = l.input),
              P(Q);
            break;
          case "file":
            ((Q = A(d, n.file)).placeholder = l.inputPlaceholder),
              (Q.type = l.input),
              P(Q);
            break;
          case "range":
            var ee = A(d, n.range),
              te = ee.querySelector("input"),
              ne = ee.querySelector("output");
            (te.value = l.inputValue),
              (te.type = l.input),
              (ne.value = l.inputValue),
              P(ee);
            break;
          case "select":
            var oe = A(d, n.select);
            if (((oe.innerHTML = ""), l.inputPlaceholder)) {
              var re = document.createElement("option");
              (re.innerHTML = l.inputPlaceholder),
                (re.value = ""),
                (re.disabled = !0),
                (re.selected = !0),
                oe.appendChild(re);
            }
            G = function (e) {
              for (var t in e) {
                var n = document.createElement("option");
                (n.value = t),
                  (n.innerHTML = e[t]),
                  l.inputValue === t && (n.selected = !0),
                  oe.appendChild(n);
              }
              P(oe), oe.focus();
            };
            break;
          case "radio":
            var ie = A(d, n.radio);
            (ie.innerHTML = ""),
              (G = function (e) {
                for (var t in e) {
                  var o = document.createElement("input"),
                    r = document.createElement("label"),
                    i = document.createElement("span");
                  (o.type = "radio"),
                    (o.name = n.radio),
                    (o.value = t),
                    l.inputValue === t && (o.checked = !0),
                    (i.innerHTML = e[t]),
                    r.appendChild(o),
                    r.appendChild(i),
                    (r.for = o.id),
                    ie.appendChild(r);
                }
                P(ie);
                var a = ie.querySelectorAll("input");
                a.length && a[0].focus();
              });
            break;
          case "checkbox":
            var ae = A(d, n.checkbox),
              le = i("checkbox");
            (le.type = "checkbox"),
              (le.value = 1),
              (le.id = n.checkbox),
              (le.checked = Boolean(l.inputValue));
            var se = ae.getElementsByTagName("span");
            se.length && ae.removeChild(se[0]),
              ((se = document.createElement("span")).innerHTML =
                l.inputPlaceholder),
              ae.appendChild(se),
              P(ae);
            break;
          case "textarea":
            var ue = A(d, n.textarea);
            (ue.value = l.inputValue),
              (ue.placeholder = l.inputPlaceholder),
              P(ue);
            break;
          case null:
            break;
          default:
            console.error(
              'SweetAlert2: Unexpected type of input! Expected "text", "email", "password", "number", "tel", "select", "radio", "checkbox", "textarea", "file" or "url", got "' +
                l.input +
                '"'
            );
        }
        ("select" !== l.input && "radio" !== l.input) ||
          (l.inputOptions instanceof Promise
            ? (e.showLoading(),
              l.inputOptions.then(function (t) {
                e.hideLoading(), G(t);
              }))
            : "object" === R(l.inputOptions)
            ? G(l.inputOptions)
            : console.error(
                "SweetAlert2: Unexpected type of inputOptions! Expected object or Promise, got " +
                  R(l.inputOptions)
              )),
          z(l.animation, l.onOpen),
          l.allowEnterKey
            ? K(-1, 1)
            : document.activeElement && document.activeElement.blur(),
          (u().scrollTop = 0),
          "undefined" == typeof MutationObserver ||
            W ||
            (W = new MutationObserver(e.recalculateHeight)).observe(d, {
              childList: !0,
              characterData: !0,
              subtree: !0,
            });
      });
    };
  return (
    ($.isVisible = function () {
      return !!c();
    }),
    ($.queue = function (e) {
      D = e;
      var t = function () {
          (D = []), document.body.removeAttribute("data-swal2-queue-step");
        },
        n = [];
      return new Promise(function (e, o) {
        !(function r(i, a) {
          i < D.length
            ? (document.body.setAttribute("data-swal2-queue-step", i),
              $(D[i]).then(
                function (e) {
                  n.push(e), r(i + 1, a);
                },
                function (e) {
                  t(), o(e);
                }
              ))
            : (t(), e(n));
        })(0);
      });
    }),
    ($.getQueueStep = function () {
      return document.body.getAttribute("data-swal2-queue-step");
    }),
    ($.insertQueueStep = function (e, t) {
      return t && t < D.length ? D.splice(t, 0, e) : D.push(e);
    }),
    ($.deleteQueueStep = function (e) {
      void 0 !== D[e] && D.splice(e, 1);
    }),
    ($.close = $.closeModal =
      function (e) {
        var t = u(),
          o = c();
        if (o) {
          B(o, n.show), E(o, n.hide), clearTimeout(o.timeout), H();
          var r = function () {
            t.parentNode && t.parentNode.removeChild(t),
              B(document.documentElement, n.shown),
              B(document.body, n.shown),
              Q(),
              _();
          };
          O && !x(o, n.noanimation)
            ? o.addEventListener(O, function e() {
                o.removeEventListener(O, e), x(o, n.hide) && r();
              })
            : r(),
            null !== e &&
              "function" == typeof e &&
              setTimeout(function () {
                e(o);
              });
        }
      }),
    ($.clickConfirm = function () {
      return b().click();
    }),
    ($.clickCancel = function () {
      return w().click();
    }),
    ($.showLoading = $.enableLoading =
      function () {
        var e = c();
        e || $("");
        var t = h(),
          o = b(),
          r = w();
        P(t),
          P(o, "inline-block"),
          E(t, n.loading),
          E(e, n.loading),
          (o.disabled = !0),
          (r.disabled = !0);
      }),
    ($.setDefaults = function (t) {
      if (!t || "object" !== (void 0 === t ? "undefined" : R(t)))
        return console.error(
          "SweetAlert2: the argument for setDefaults() is required and has to be a object"
        );
      for (var n in t)
        e.hasOwnProperty(n) ||
          "extraParams" === n ||
          (console.warn('SweetAlert2: Unknown parameter "' + n + '"'),
          delete t[n]);
      I(K, t);
    }),
    ($.resetDefaults = function () {
      K = I({}, e);
    }),
    ($.noop = function () {}),
    ($.version = "6.6.6"),
    ($.default = $),
    $
  );
}),
  window.Sweetalert2 && (window.sweetAlert = window.swal = window.Sweetalert2);
