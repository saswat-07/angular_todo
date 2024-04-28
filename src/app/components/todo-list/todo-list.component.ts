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
    let newList: TaskModel[] = this.GetAll();
    let index = newList.findIndex(x => x.TaskId == taskId);
    if (index != null && typeof index == "number" && newList.length > index) {
      let obj = newList[index];
      if (obj != null && typeof obj != "undefined") {
        obj.IsCompleted = !currentValue;
        newList[index] = obj;
        this.Save(newList);
        this.list = this.Search();
      }
    }
  }

  EditTask(taskId: number) {
    let newList: TaskModel[] = this.GetAll();
    let index = newList.findIndex(x => x.TaskId == taskId);
    if (index != null && typeof index == "number" && newList.length > index) {
      let taskName = prompt("Please enter new task name", newList[index].TaskName);
      if (taskName != null && taskName != '') {
        newList[index].TaskName = taskName;
        this.Save(newList);
        this.list = this.Search();
      }
    }
  }

  Delete(taskId: number) {
    let newList: TaskModel[] = this.GetAll();
    let index = newList.findIndex(x => x.TaskId == taskId);
    if (index != null && typeof index == "number" && newList.length > index) {
      newList.splice(index, 1);
      this.Save(newList);
      this.list = this.Search();
    }
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
