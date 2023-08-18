import { AuthenticationService, UserService } from '@_core/services';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { User } from '@_core/models';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit, OnDestroy {
  users: any[] = [];
  selectedUser: any = null; 
  editMode = false;
  totalUsers: number;
  currentPage: number = 1;
  userForm: FormGroup;
  output : any;
  spinnerResourcesLoaded:boolean = false;
  firstNameInput: any;

  //sorting
  sortField: string;
  sortOrder: number;

  //filter stuff added
  filterOptions: any[] = [
    { label: 'All', value: null },
    { label: 'Admin', value: 'Admin' },
    { label: 'User', value: 'User' }
  ];
  selectedFilterOption: string; // Track the selected filtering option
  filteredUsers: any[]; // Array to store filtered users

  constructor(private authenticationService: AuthenticationService, private userService: UserService, private formBuilder: FormBuilder, private messageService: MessageService) {}
 
  ngOnInit(): void {
    this.loadUsers();
    this.initForm();
    this.selectedFilterOption = null;
  }
  
  getValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe(
      (data: any) => {
        this.users = data.users;
        this.totalUsers = this.users.length;
        this.filteredUsers = this.users;
      },
      (error: any) => {
        console.error('Error loading users:', error);
      }
    );
  }

  selectUser(user: any): void {
    this.cancelEdit();
    this.selectedUser = user;
    console.log("User selected", user);

    this.userForm.patchValue({
      username: this.selectedUser.username,
      firstName: this.selectedUser.firstName,
      lastName: this.selectedUser.lastName,
      title: this.selectedUser.title,
      team: this.selectedUser.team,
      roles: this.selectedUser.roles,
      email: this.selectedUser.email,
      phoneno: this.selectedUser.phoneno,
      ern: this.selectedUser.ern,
    });
  }
    enterEditMode(): void {
      this.editMode = true;
      this.enableInput();
    }
    cancelEdit(): void {
      this.editMode = false;
      this.initForm();
    }
    isFieldInvalid(fieldName: string): boolean {
      const control = this.userForm.get(fieldName);
      return control.invalid && (control.dirty || control.touched);
    }
    enableInput(){
      // this.userForm.enable();
      // this.userForm.get('username').enable();
      this.userForm.get('firstName').enable();
      this.userForm.get('lastName').enable();
      this.userForm.get('title').enable();
      this.userForm.get('team').enable();
      // this.userForm.get('roles').enable();
      this.userForm.get('email').enable();
      this.userForm.get('phoneno').enable();
      this.userForm.get('ern').enable();
    }
    
    disableInput(){
      // this.userForm.disable();
      this.userForm.get('username').disable();
      this.userForm.get('firstName').disable();
      this.userForm.get('lastName').disable();
      this.userForm.get('title').disable();
      this.userForm.get('team').disable();
      this.userForm.get('roles').disable();
      this.userForm.get('email').disable();
      this.userForm.get('phoneno').disable();
      this.userForm.get('ern').disable();
    }

    private initForm(){
      this.userForm = this.formBuilder.group({
        username: '',
        firstName: ['', Validators.required], 
        lastName:  ['', Validators.required],
        title: '',
        team: '',
        roles: '',
        email: '',
        phoneno: '',
        ern: '',
      });

      this.disableInput();
    
      if (this.selectedUser) {
        this.userForm.patchValue({
          username: this.selectedUser.username,
          firstName: this.selectedUser.firstName,
          lastName: this.selectedUser.lastName,
          title: this.selectedUser.title,
          team: this.selectedUser.team,
          roles: this.selectedUser.roles,
          email: this.selectedUser.email,
          phoneno: this.selectedUser.phoneno,
          ern: this.selectedUser.ern,
        });
      }
    }
    onSubmit() {
      console.log(this.selectedUser);
      console.log("Form data", this.userForm);
      if (this.userForm.valid) {
        const userData = {
          userid: this.selectedUser.userid, 
          username: this.selectedUser.username,
          firstName: this.userForm.value.firstName,
          lastName: this.userForm.value.lastName,
          title: this.userForm.value.title,
          team: this.userForm.value.team,
          roles: this.userForm.value.roles,
          email: this.userForm.value.email,
          phoneno: this.userForm.value.phoneno,
          ern: this.userForm.value.ern,
        };

        this.spinnerResourcesLoaded = true;
        this.userService.updateUserInfo(userData).subscribe(
          (response: any) => {
            console.log('User info updated successfully:', response);
            this.cancelEdit();
            this.loadUsers();
            this.spinnerResourcesLoaded = false;
            this.showToast();
          },
          (error: any) => {
            console.error('Error updating user info:', error);
            this.spinnerResourcesLoaded = false;
          }
        );
        this.selectUser(userData);
      }
      else{
        this.messageService.add({
          severity: 'error',
          summary: 'Validation Error',
          detail: 'Please fill in all required fields.',
        });
      }
    }
    showToast(){
      this.messageService.add({ severity: 'success', summary: 'Success!', detail: 'User Information has been updated'});
    }

  //Sorting
    compare = (a: any, b: any) => {
      const aValue = a[this.sortField];
      const bValue = b[this.sortField];
        if (aValue < bValue) {
          return -this.sortOrder;
        }
        if (aValue > bValue) {
          return this.sortOrder;
        }
        return 0;
      };

    sort(field: string) {
      if (this.sortField === field) {
        this.sortOrder *= -1;
      } else {
        this.sortField = field;
        this.sortOrder = 1;
      }
      this.users.sort(this.compare);
    }

    sortOptions: any[] = [
      { label: 'Username', value: 'username' },
      { label: 'First Name', value: 'firstName' },
      { label: 'Last Name', value: 'lastName' },
      // { label: 'Role', value: 'roles' }
    ];
    selectedSortOption: string; // Track the selected sorting option
  
    applySort() {
      if (this.selectedSortOption) {
        this.sort(this.selectedSortOption);
      }
    }

    //Filter
    applyFilter() {
      console.log('Selected Filter:', this.selectedFilterOption);
        if (this.selectedFilterOption) {
          this.filteredUsers = this.users.filter(
          user => user.roles === this.selectedFilterOption
        );
        } else {
          this.filteredUsers = this.users; // Show all users when no filter selected
        }
          console.log('Filtered Users:', this.filteredUsers);
    }

    ngOnDestroy(): void {
    } 
}
