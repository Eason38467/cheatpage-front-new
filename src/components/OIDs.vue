<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <Toast/>

        <Toolbar class="mb-4">

          <template v-slot:start>
            <div class="my-2">
              <Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
              <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedoids || !selectedoids.length" />
            </div>
          </template>

          <template v-slot:end>
            <FileUpload mode="basic" name="demo[]" :auto="true" url="upload" :maxFileSize="1000000" label="Import" chooseLabel="Import"  class="mr-2 inline-block" />
            <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)"  />
          </template>

        </Toolbar>

        <DataTable ref="dt" :value="oidList" v-model:selection="selectedoids" dataKey="_id" :paginator="true" :rows="10" :filters="filters"
                   paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25,50]"
                   currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" responsiveLayout="scroll">

          <template #header>
            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
              <h5 class="m-0">OIDs</h5>
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

          <Column field="oid" header="OID"  >
            <template #body="slotProps">
              <span class="p-column-title">OID</span>
              {{slotProps.data.oid}}
            </template>
          </Column>

          <Column field="desc" header="Description"  >
            <template #body="slotProps">
              <span class="p-column-title">Description</span>
              {{slotProps.data.desc}}
            </template>
          </Column>


          <Column field="tags" header="Platforms"  >
            <template #body="slotProps">
              <span class="p-column-title">Platforms</span>
              <span class="p-tag p-tag-info" v-for="tag of slotProps.data.tags" style="margin: 5px">{{tag}}</span>
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
              <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editoid(slotProps.data)" />
              <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteoid(slotProps.data)" />
            </template>
          </Column>
        </DataTable>


        <Dialog v-model:visible="oidDialog" :style="{width: '450px'}" header="OID Detail" :modal="true" class="p-fluid">
          <div class="field">
            <label for="name">Name</label>
            <InputText id="name"  v-model.trim="newoid.oid" required="true" autofocus :class="{'p-invalid': submitted && !newoid.oid}" />
            <small class="p-invalid" v-if="submitted && !newoid.oid">Name is required.</small>
          </div>
          <div class="field">
            <label for="description">Description</label>
            <Textarea id="description" v-model="newoid.desc" required="true" rows="3" cols="20" />
          </div>

          <div class="field">
            <label class="p-mb-3">Platforms</label>

            <div class="p-d-inline">

            <div class="p-col-6" style="margin-top: 10px">
              <Checkbox id="platform1" name="platform" value="N3K" v-model="newoid.tags" />
              <label for="platform1" style="margin-right: 50px">N3K</label>
              <Checkbox id="platform2" name="platform" value="N5K/N6K" v-model="newoid.tags" />
              <label for="platform2">N5K/N6K</label>
            </div>


            <div class="p-field-checkbox p-col-6" style="margin-top: 10px">
              <Checkbox id="platform3" name="platform" value="N7K" v-model="newoid.tags" />
              <label for="platform3" style="margin-right: 50px">N7K</label>
              <Checkbox id="platform4" name="platform" value="N9K" v-model="newoid.tags" />
              <label for="platform4">N9K</label>
            </div>

            </div>

          </div>

          <template #footer>
            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
            <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveoid" />
          </template>
        </Dialog>







        <Dialog v-model:visible="deleteoidDialog" :style="{width: '450px'}" header="Confirm" :modal="true" >
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="oidList">Are you sure you want to delete <b>{{oidList.oid}}</b>?</span>
          </div>
          <template #footer>
            <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteoidDialog = false"/>
            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteoid" />
          </template>
        </Dialog>



        <Dialog v-model:visible="deleteoidsDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="oidList">Are you sure you want to delete the selected products?</span>
          </div>
          <template #footer>
            <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteoidsDialog = false"/>
            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedoids" />
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

      oidList: null,
      loading1: true,
      oidDialog: false,
      newoid: {},

      deleteoidDialog: false,
      deleteoidsDialog: false,
      selectedoids: null,

      filters: {},
      submitted: false,


    }
  },


  created() {

    this.getoid();

    this.initFilters();
  },



  methods: {

    getoid(){
      axios.get('/api/oid').then(res=>{
        this.oidList=res.data
        this.loading1=false
      }).catch(err=>console.log(err));
    },

    dateFormatter (datetime) {

      return moment(datetime).format("YYYY-MM-DD HH:mm:ss")
    },





    openNew() {
      this.oidlist = {};
      this.submitted = false;
      this.oidDialog = true;
    },


    hideDialog() {
      this.oidDialog = false;
      this.submitted = false;
    },

    saveoid() {
      this.submitted = true;


      if (this.newoid.oid.trim()) {
        if (this.newoid._id) {



          axios.post(`api/oid/editoid/${this.newoid._id}`, this.newoid)
              .then(res=>{
                this.$toast.add({severity:'success', summary: 'Successful', detail: 'OID Updated', life: 3000});
              })
              .catch(err=>{
                this.$toast.add({severity:'error', summary: '提交失败', detail:'提交失败', life: 3000});
              })
        }
        else {

          axios.post(`api/oid/addoid`, this.newoid)
              .then(res=>{
                this.$toast.add({severity:'success', summary: 'Successful', detail: 'OID Created', life: 3000});
              })
              .catch(err=>{
                this.$toast.add({severity:'error', summary: '提交失败', detail:'提交失败', life: 3000});
              })
        }
        this.oidDialog = false;
        this.newoid = {};
        this.getoid()

      }
    },


    editoid(val) {

      this.newoid = {...val};
      this.oidDialog = true;
    },


    confirmDeleteoid(val) {


      this.newoid = val;
      this.deleteoidDialog = true;
    },
    deleteoid() {

      axios.delete(`api/oid/deloid/${this.newoid._id}`, this.newoid)
          .then(res=>{
            this.$toast.add({severity:'success', summary: 'Successful', detail: 'OID Removed', life: 3000});
          })
          .catch(err=>{
            this.$toast.add({severity:'error', summary: '提交失败', detail:'提交失败', life: 3000});
          })
      this.deleteoidDialog = false;
      this.newoid = {};
      this.getoid()

    },



    confirmDeleteSelected() {

      this.deleteoidsDialog = true;
    },
    deleteSelectedoids() {


      for(let num = 0 ; num < this.selectedoids.length;num++){

        axios.delete(`api/oid/deloid/${this.selectedoids[num]._id}`, this.selectedoids[num])
            .then(res=>{
              this.$toast.add({severity:'success', summary: 'Successful', detail: 'OIDs Removed', life: 3000});
            })
            .catch(err=>{
              this.$toast.add({severity:'error', summary: '提交失败', detail:'提交失败', life: 3000});
            })

      }

      this.deleteoidsDialog = false;
      this.selectedoids = null;
      this.getoid()
    },

    exportCSV() {
      this.$refs.dt.exportCSV();
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
</style>
