<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <Toast/>

        <Toolbar class="mb-4">

          <template v-slot:end>
            <div class="my-2">
              <Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
              <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedAbbs || !selectedAbbs.length" />
            </div>
          </template>


        </Toolbar>

        <DataTable ref="dt" :value="abbList" v-model:selection="selectedAbbs" dataKey="_id" :paginator="true" :rows="10" :filters="filters"
                   paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25,50]"
                   currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" responsiveLayout="scroll">

          <template #header>
            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
              <h5 class="m-0">Abbreviation</h5>
              <span class="block mt-2 md:mt-0 p-input-icon-left">
                <i class="pi pi-search" />
                <InputText v-model="filters['global'].value" placeholder="Search..." />
              </span>
            </div>
          </template>

          <template #empty>
            无数据。
          </template>
          <template #loading>
            正在加载数据，请稍后...
          </template>

          <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>

          <Column field="abb" header="Abbreviation/Logs"  >
            <template #body="slotProps">
              <span class="p-column-title">Abbreviation/Logs</span>
              {{slotProps.data.abb}}
            </template>
          </Column>

          <Column field="desc" header="Description"  >
            <template #body="slotProps">
              <span class="p-column-title">Description</span>
              <ScrollPanel style=" height: 100px" class="custombar1">
                <p>
                  {{slotProps.data.desc}}
                </p>
              </ScrollPanel>

            </template>
          </Column>

          <Column header="Update Date" headerStyle="width:14%; min-width:10rem;" >
            <template #body="slotProps">
              <span class="p-column-title">Update Date</span>
              {{dateFormatter(slotProps.data.date)}}
            </template>
          </Column>


          <Column headerStyle="min-width:10rem;">
            <template #body="slotProps">
              <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editabb(slotProps.data)" />
              <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteAbb(slotProps.data)" />
            </template>
          </Column>
        </DataTable>


        <Dialog v-model:visible="abbDialog" :style="{width: '450px'}" header="Abbreviation Detail" :modal="true" class="p-fluid">
          <div class="field">
            <label for="name">Name</label>
            <InputText id="name"  v-model.trim="newabb.abb" required="true" autofocus :class="{'p-invalid': submitted && !newabb.abb}" />
            <small class="p-invalid" v-if="submitted && !newabb.abb">Name is required.</small>
          </div>
          <div class="field">
            <label for="description">Description</label>
            <Textarea id="description" v-model="newabb.desc" required="true" rows="3" cols="20" />
          </div>

          <template #footer>
            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
            <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveAbb" />
          </template>
        </Dialog>







        <Dialog v-model:visible="deleteAbbDialog" :style="{width: '450px'}" header="Confirm" :modal="true" >
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="abbList">Are you sure you want to delete <b>{{abbList.abb}}</b>?</span>
          </div>
          <template #footer>
            <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteAbbDialog = false"/>
            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteAbb" />
          </template>
        </Dialog>



        <Dialog v-model:visible="deleteAbbsDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="abbList">Are you sure you want to delete the selected products?</span>
          </div>
          <template #footer>
            <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteAbbsDialog = false"/>
            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedAbbs" />
          </template>
        </Dialog>

      </div>
    </div>
  </div>

</template>

<script>
import {FilterMatchMode} from 'primevue/api';
import axios from "axios";
import moment from 'moment'



export default {
  data() {
    return {

      abbList: null,
      loading1: true,
      abbDialog: false,
      newabb: {},


      deleteAbbDialog: false,
      deleteAbbsDialog: false,
      selectedAbbs: null,





      filters: {},
      submitted: false,


    }
  },


  created() {

    this.getAbbreviation()

    this.initFilters();
  },



  methods: {
    getAbbreviation(){
      axios.get('/api/abbreviation').then(res=>{
        this.abbList=res.data
        this.loading1=false
      }).catch(err=>console.log(err));
    },

    dateFormatter (datetime) {

      return moment(datetime).format("YYYY-MM-DD HH:mm:ss")
    },





    openNew() {
      this.addlist = {};
      this.submitted = false;
      this.abbDialog = true;
    },


    hideDialog() {
      this.abbDialog = false;
      this.submitted = false;
    },

    saveAbb() {
      this.submitted = true;


      if (this.newabb.abb.trim()) {
        if (this.newabb._id) {

          // console.log('edit abb')
          // console.log(this.newabb)


          axios.post(`api/abbreviation/editabb/${this.newabb._id}`, this.newabb)
              .then(res=>{
                this.$toast.add({severity:'success', summary: 'Successful', detail: 'abbreviation Updated', life: 3000});
              })
              .catch(err=>{
                this.$toast.add({severity:'error', summary: '提交失败', detail:'提交失败', life: 3000});
              })
        }
        else {
          // console.log('create abb')
          // console.log(this.newabb)
          axios.post(`api/abbreviation/addabb`, this.newabb)
              .then(res=>{
                this.$toast.add({severity:'success', summary: 'Successful', detail: 'abbreviation Created', life: 3000});
              })
              .catch(err=>{
                this.$toast.add({severity:'error', summary: '提交失败', detail:'提交失败', life: 3000});
              })
        }
        this.abbDialog = false;
        this.newabb = {};
        this.getAbbreviation()

      }
    },


    editabb(abb) {

      this.newabb = {...abb};
      this.abbDialog = true;
    },


    confirmDeleteAbb(abb) {
      // console.log('delet')
      // console.log(abb)

      this.newabb = abb;
      this.deleteAbbDialog = true;
    },
    deleteAbb() {
      console.log(this.newabb)

      axios.delete(`api/abbreviation/delabb/${this.newabb._id}`, this.newabb)
          .then(res=>{
            this.$toast.add({severity:'success', summary: 'Successful', detail: 'abbreviation Removed', life: 3000});
          })
          .catch(err=>{
            this.$toast.add({severity:'error', summary: '提交失败', detail:'提交失败', life: 3000});
          })
      this.deleteAbbDialog = false;
      this.newabb = {};
      this.getAbbreviation()

    },



    confirmDeleteSelected() {

      this.deleteAbbsDialog = true;
    },
    deleteSelectedAbbs() {

      // console.log(this.selectedAbbs)

      for(let num = 0 ; num < this.selectedAbbs.length;num++){
        // console.log( this.selectedAbbs[num]._id +  this.selectedAbbs[num].abb)

        axios.delete(`api/abbreviation/delabb/${this.selectedAbbs[num]._id}`, this.selectedAbbs[num])
            .then(res=>{
              this.$toast.add({severity:'success', summary: 'Successful', detail: 'abbreviation Removed', life: 3000});
            })
            .catch(err=>{
              this.$toast.add({severity:'error', summary: '提交失败', detail:'提交失败', life: 3000});
            })

      }

      // this.products = this.products.filter(val => !this.selectedAbbs.includes(val));
      this.deleteAbbsDialog = false;
      this.selectedAbbs = null;
      this.getAbbreviation()
    },


    initFilters() {
      this.filters = {
        'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
      }
    }
  }
}
</script>

<style scoped lang="scss">

::v-deep(.p-scrollpanel) {
  p {
    padding: .5rem;
    line-height: 1.5;
    margin: 0;
  }

  &.custombar1 {
    .p-scrollpanel-wrapper {
      border-right: 9px solid var(--surface-b);
    }

    .p-scrollpanel-bar {
      background-color: var(--primary-color);
      opacity: 1;
      transition: background-color .2s;

      &:hover {
        background-color: #007ad9;
      }
    }
  }

  &.custombar2 {
    .p-scrollpanel-wrapper {
      border-right: 9px solid var(--surface-b);
      border-bottom: 9px solid var(--surface-b);
    }

    .p-scrollpanel-bar {
      background-color: var(--surface-d);
      border-radius: 0;
      opacity: 1;
      transition: background-color .2s;
    }
  }
}
</style>
