import { Component, OnInit } from '@angular/core';
import { TaskModel } from '../../models/task.model';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    FormsModule,
    NgFor,
    NgIf
  ],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css'
})
export class TodoListComponent implements OnInit {
  
  list: TaskModel[] = []
  task: string = '';
  searchText: string = '';
  
  ngOnInit(): void {
    this.list = this.GetAll();
  }

  AddTask() {
    if(this.task != null && this.task != '') {
      let obj: TaskModel = {
        TaskId: new Date().getTime(),
        TaskName: this.task,
        IsCompleted: false
      };
      this.list.push(obj);
      this.Save(this.list);
      this.task = '';
    }
  }

  ChangeStatus(taskId: number, currentValue: boolean) {
    // debugger;
    const newList: TaskModel[] = this.GetAll();
    const taskToUpdate = newList.find((task) => task.TaskId === taskId);
  
    if (taskToUpdate) {
      taskToUpdate.IsCompleted = !currentValue;
      this.Save(newList);
      this.list = this.Search();
    }
  }

  EditTask(taskId: number) {
    const newList = this.GetAll();
    const taskToEdit = newList.find((task: TaskModel) => task.TaskId === taskId);
  
    if (taskToEdit) {
      const taskName = prompt("Please enter new task name", taskToEdit.TaskName ?? '');
  
      if (taskName !== null && taskName !== '') {
        taskToEdit.TaskName = taskName;
        this.Save(newList);
        this.list = this.Search();
      }
    }
  }

  Delete(taskId: number) {
    let newList: TaskModel[] = this.GetAll();
    this.list = newList.filter(x => x.TaskId != taskId);
    this.Save(this.list);
    this.list = this.Search();
  }

  DeleteAll() {
    this.list = [];
    this.Save(this.list);
  }

  Save(list: TaskModel[]) {
    localStorage.setItem("todo", JSON.stringify(list));
  }

  GetAll() {
    let value = localStorage.getItem("todo");
    if (value != '' && value != null && typeof value != "undefined") {
      return JSON.parse(value!);
    }
    return [];
  }

  SearchTask() {
    if (this.searchText != null && this.searchText != "" && typeof this.searchText != "undefined") {
      this.list = this.Search();
    }
  }

  Search() {
    let newList = this.GetAll();
    return newList.filter((x: TaskModel) => {
      return x.TaskName.toLocaleLowerCase().includes(this.searchText.toLocaleLowerCase());
    });
  }

  Clear() {
    this.searchText = "";
    this.list = this.Search();
  }
}
