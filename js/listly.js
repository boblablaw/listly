var Listly = function () {

  function Listly() {
    var self = this;
    self.tasks = [];

    function addTask(task_name) {
      var task = new Task({ name: task_name })
      self.tasks.push(task);
      if (task_name !== '' && save()) {
          appendToList(task);
          return true;
      } else {
          return false;
      }
    }

    function appendToList(task) {
      var li = $('#list_item_template').clone();

      li.removeAttr('id').removeClass('hidden');

      li.find('label').text(task.name);

      $('#tasks').append(li);

      li.find('button.delete').click(task, removeFromList);
      li.find('button.edit').click(task, createEditForm); 
    }

    function createEditForm(ev) {
      var edit_form, name_field, task, li, label;
      
      task = ev.data;
      li = $(this).closest('li');
      label = li.find('label')

      edit_form = $('#edit_form_template').clone().removeAttr('id');
      edit_form.removeClass('hidden');
      edit_form.removeAttr('id');
      
      name_field = edit_form.find('.edit-task-name');
      name_field.data('task-id', task.id).val(task.name);
      name_field.val(task.name);

      li.find('.btn-group').addClass('hidden');
      label.addClass('hidden');      
      edit_form.insertBefore(label);
      name_field.focus().select();
      //old process
      //li.find('label').replaceWith(edit_form);

      
      // Save and Cancel handlers
      edit_form.submit(updateTask);
      edit_form.find('button.cancel').click(function(ev) {
        removeEditForm(edit_form);
      });
    }

    function updateTask(ev) {
      //this = edit_form;
      ev.preventDefault();

      var field, id;

      field = $(this.elements.task_name);
      id = field.data('task-id');

      $.each(self.tasks, function(index, task) {
        if (task.id == id) {
          task.name = field.val();
          return false;  // breaks out of the loop
        }
      });

      if (save()) {
        $(this).siblings('label').text(field.val());
        removeEditForm(this);
      }
    }      

    function removeEditForm(form) {
      var label;
      form = $(form);

      label = form.siblings('label');
      field = form.find('.edit-task-name');

      label.removeClass('hidden');
      form.siblings('.btn-group').removeClass('hidden');
      form.remove();
    }

    function removeFromList(ev) {
      var task = ev.data;
      var item = this.closest('li')
      self.tasks.splice(self.tasks.indexOf(task), 1);
      item.remove();
      save()
    }

    function showFormError(form) {
      $(form).find('.alert')
        .html('<em>Yo dawg<em>, something\s up!!')
        .removeClass('hidden');
    }

    function removeFormError(form) {
      $(form).addClass('hidden');
    }

    function supportsLocalStorage() {
      try {
        return 'localStorage' in window && window.localStorage !== null;
      } catch (err) {
        return false;
      }
    }

    function load() {
      if (supportsLocalStorage() && localStorage.tasks) {
        var task;
        var task_objects = JSON.parse(localStorage.tasks);
        $.each(task_objects, function(index, task_properties) {
          task = new Task(task_properties);
          self.tasks.push(task);
          appendToList(task);
        });
      }
    }

    function save() {
      if (supportsLocalStorage()) {
        return (localStorage.tasks = JSON.stringify(self.tasks));
      } else {
        return false;
      }
    }

    load();

    $('form#new_task').submit(function(ev) {
      ev.preventDefault();
      var field, task_name;
      
      field = $(this.task_name);
      task_name = field.val();

      if (addTask(task_name)) {
        field.val('');
      } else {
         showFormError(this);
      }
      field.focus().select();
    });
  }

  return Listly;
}();

var listly = new Listly();
