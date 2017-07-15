import { Component, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs/Rx';

/// ��� ������� md-table �� ������� � ����� https://material.angular.io/components/table/overview
import { DataSource } from '@angular/cdk';
import { MdSort } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
// ------------------------------------------------------------------------------------------- //

import { Sort } from '@angular/material';

export interface ProjectInterface {
    id: number;
    name: string;
    coding: number;
    build: number;
    debug: number;
}

export interface TaskInterface {
    id: number;
    name: string;
    time: number;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent {
    title = 'app';

    projects:ProjectInterface[] = [
        {id: 1, name: 'Project 0', coding: 0, build: 0, debug: 0},
        {id: 2, name: 'Project 1', coding: 0, build: 0, debug: 0},
        {id: 3, name: 'Project 2', coding: 0, build: 0, debug: 0}
    ];

    tasks:TaskInterface[] = [
        {id: 1, name: 'coding', time: 0},
        {id: 2, name: 'build', time: 0},
        {id: 3, name: 'debug', time: 0}
    ];

    currentProject:ProjectInterface;
    currentProjectId:number;
    currentTask:TaskInterface;
    currentTaskId:number;

    ticks = 0;
    checkTime = false;
    alwaysCheckTime = false;

    /// @ViewChild(MdSort)
    displayedColumns = ['name', 'time'];
    headers = ['Проект', 'Задача', 'Задача'];
    exampleDatabase:any;
    dataSource:any;

    section = 0;


    @ViewChild(MdSort) sort:MdSort;

    ngOnInit() {
        this.setCurrentProject(1);
        this.setCurrentTask(1);
        this.exampleDatabase = new ExampleDatabase(this.projects);
        this.dataSource = new ExampleDataSource(this.exampleDatabase, this.sort);
    }

    constructor() {
        let timer = Observable.timer(0, 1000);

        timer.subscribe((t:any) => {
            this.ticks = t;
            if (this.checkTime || this.alwaysCheckTime) {
                let _project = this.projects.find((project:any)=> project.id == this.currentProjectId);
                let _task = this.tasks.find((task:any)=> task.id == this.currentTaskId);
                _project[_task.name]++;
                _task.time++;
            }
        });
    }

    setCurrentProject(projectId:number) {
        this.checkTime = false;
        this.currentProject = this.projects.find((project:any)=> project.id == projectId);
        this.currentProjectId = this.currentProject.id;
    }

    setCurrentTask(taskId:number) {
        this.checkTime = false;
        this.currentTask = this.tasks.find((task:any)=> task.id == taskId);
        this.currentTaskId = this.currentTask.id;
    }

    reloadData(event:any) {
        if (event.index != null) {
            this.section = event.index;
            switch (event.index) {
                case 0:
                    this.exampleDatabase = new ExampleDatabase(this.projects);
                    break;
                case 1:
                    this.exampleDatabase = new ExampleDatabase(this.tasks);
                    break;
                case 2:
                    this.exampleDatabase = new ExampleDatabase(this.tasks);
                    break;
            }
            this.dataSource = new ExampleDataSource(this.exampleDatabase, this.sort);
        }
    }

    getTime(row:any, id: number) {
        switch (id) {
            case 0:
                return row.coding + row.build + row.debug;
            case 1:
                return this.currentProject[row.name];
            case 2:
                return row.time;
        }
    }

}

//** An example database that the data source uses to retrieve data for the table.
export class ExampleDatabase {
    //** Stream that emits whenever the data has been modified.
    dataChange:BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

    get data():any[] {
        return this.dataChange.value;
    }

    constructor(array:any[]) {
        // Fill up the database with 100 users.
        for (let i = 0; i < array.length; i++) {
            this.addItem(array[i]);
        }
    }

    //** Adds a new user to the database.
    addItem(item:any) {
        const copiedData = this.data.slice();
        copiedData.push(item);
        this.dataChange.next(copiedData);
    }
}

/**
 * Data source to provide what data should be rendered in the table. Note that the data source
 * can retrieve its data in any way. In this case, the data source is provided a reference
 * to a common data base, ExampleDatabase. It is not the data source's responsibility to manage
 * the underlying data. Instead, it only needs to take the data and send the table exactly what
 * should be rendered.
 */
export class ExampleDataSource extends DataSource<any> {
    constructor(private _exampleDatabase:ExampleDatabase, private _sort:MdSort) {
        super();
    }

    //** Connect function called by the table to retrieve one stream containing the data to render.
    connect():Observable<any[]> {
        const displayDataChanges = [
            this._exampleDatabase.dataChange,
            this._sort.mdSortChange,
        ];

        return Observable.merge(...displayDataChanges).map(() => {
            return this.getSortedData();
        });
    }

    disconnect() {
    }

    //** Returns a sorted copy of the database data.
    getSortedData():any[] {
        const data = this._exampleDatabase.data.slice();
        if (!this._sort.active || this._sort.direction == '') {
            return data;
        }

        return data.sort((a, b) => {
            let propertyA:number|string = '';
            let propertyB:number|string = '';

            switch (this._sort.active) {
                case 'time':
                    [propertyA, propertyB] = [a.coding + a.build + a.debug, b.coding + b.build + b.debug];
                    break;
                case 'name':
                    [propertyA, propertyB] = [a.name, b.name];
                    break;
            }

            let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

            return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
        });
    }
}
//*/