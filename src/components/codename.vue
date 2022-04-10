<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <Toast/>

        <Toolbar class="mb-4">

          <template v-slot:end>
            <div class="my-2">
              <Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
              <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedCodenames || !selectedCodenames.length" />
            </div>
          </template>


        </Toolbar>

        <DataTable ref="dt" :value="codenameList" v-model:selection="selectedCodenames" dataKey="_id" :paginator="true" :rows="10" :filters="filters" :loading="loading1"
                   paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25,50]"
                   currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" responsiveLayout="scroll">




          <template #header>
            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
              <h5 class="m-0">Codename List</h5>
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

          <Column field="cdname" header="Codename" filterMatchMode="contains" >
            <template #body="slotProps">
              <span class="p-column-title">Codename</span>
              {{slotProps.data.cdname}}
            </template>
          </Column>

          <Column field="desc" header="Description"  >
            <template #body="slotProps">
              <span class="p-column-title">Description</span>
              {{slotProps.data.desc}}
            </template>
          </Column>

          <Column header="Update Date"  >
            <template #body="slotProps">
              <span class="p-column-title">Update Date</span>
              {{dateFormatter(slotProps.data.date)}}
            </template>
          </Column>


          <Column headerStyle="min-width:10rem;">
            <template #body="slotProps">
              <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editcodename(slotProps.data)" />
              <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteCodename(slotProps.data)" />
            </template>
          </Column>
        </DataTable>


        <Dialog v-model:visible="codenameDialog" :style="{width: '450px'}" header="Codename Detail" :modal="true" class="p-fluid">
          <div class="field">
            <label for="name">Name</label>
            <InputText id="name"  v-model.trim="newcodename.cdname" required="true" autofocus :class="{'p-invalid': submitted && !newcodename.cdname}" />
            <small class="p-invalid" v-if="submitted && !newcodename.cdname">Name is required.</small>
          </div>
          <div class="field">
            <label for="description">Description</label>
            <Textarea id="description" v-model="newcodename.desc" required="true" rows="3" cols="20" />
          </div>

          <template #footer>
            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
            <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveCodename" />
          </template>
        </Dialog>







        <Dialog v-model:visible="deleteCodenameDialog" :style="{width: '450px'}" header="Confirm" :modal="true" >
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="codenameList">Are you sure you want to delete <b>{{codenameList.cdname}}</b>?</span>
          </div>
          <template #footer>
            <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteCodenameDialog = false"/>
            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteCodename" />
          </template>
        </Dialog>



        <Dialog v-model:visible="deleteCodenamesDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="codenameList">Are you sure you want to delete the selected products?</span>
          </div>
          <template #footer>
            <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteCodenamesDialog = false"/>
            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedCodenames" />
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

      codenameList: null,
      loading1: true,
      codenameDialog: false,
      newcodename: {},


      deleteCodenameDialog: false,
      deleteCodenamesDialog: false,
      selectedCodenames: null,


      filters: null,
      submitted: false,


    }
  },


  created() {

    this.getCodename()

    this.initFilters();
  },


  methods: {
    getCodename(){
      axios.get('/api/codename').then(res=>{
        this.codenameList=res.data
        this.loading1=false
      }).catch(err=>console.log(err));
    },

    dateFormatter (datetime) {
      return moment(datetime).format("YYYY-MM-DD HH:mm:ss")
    },


    openNew() {
      this.addlist = {};
      this.submitted = false;
      this.codenameDialog = true;
    },


    hideDialog() {
      this.codenameDialog = false;
      this.submitted = false;
    },

    saveCodename() {
      this.submitted = true;


      if (this.newcodename.cdname.trim()) {
        if (this.newcodename._id) {
          axios.post(`api/codename/editcodename/${this.newcodename._id}`, this.newcodename)
              .then(res=>{
                this.$toast.add({severity:'success', summary: 'Successful', detail: 'codename Updated', life: 3000});
              })
              .catch(err=>{
                this.$toast.add({severity:'error', summary: '提交失败', detail:'提交失败', life: 3000});
              })
        }
        else {
          axios.post(`api/codename/addcodename`, this.newcodename)
              .then(res=>{
                this.$toast.add({severity:'success', summary: 'Successful', detail: 'codename Created', life: 3000});
              })
              .catch(err=>{
                this.$toast.add({severity:'error', summary: '提交失败', detail:'提交失败', life: 3000});
              })
        }
        this.codenameDialog = false;
        this.newcodename = {};
        this.getCodename()

      }
    },


    editcodename(val) {

      this.newcodename = {...val};
      this.codenameDialog = true;
    },


    confirmDeleteCodename(val) {

      this.newcodename = val;
      this.deleteCodenameDialog = true;
    },
    deleteCodename() {
      console.log(this.vvvvvvvvvvvvvv)

      axios.delete(`api/codename/delcodename/${this.newcodename._id}`, this.newcodename)
          .then(res=>{
            this.$toast.add({severity:'success', summary: 'Successful', detail: 'Codename Removed', life: 3000});
          })
          .catch(err=>{
            this.$toast.add({severity:'error', summary: '提交失败', detail:'提交失败', life: 3000});
          })
      this.deleteCodenameDialog = false;
      this.newcodename = {};
      this.getCodename()

    },


    confirmDeleteSelected() {

      this.deleteCodenamesDialog = true;
    },
    deleteSelectedCodenames() {


      for(let num = 0 ; num < this.selectedCodenames.length;num++){

        axios.delete(`api/codename/delcodename/${this.selectedCodenames[num]._id}`, this.selectedCodenames[num])
            .then(res=>{
              this.$toast.add({severity:'success', summary: 'Successful', detail: 'Codenames Removed', life: 3000});
            })
            .catch(err=>{
              this.$toast.add({severity:'error', summary: '提交失败', detail:'提交失败', life: 3000});
            })

      }

      // this.products = this.products.filter(val => !this.selectedCodenames.includes(val));
      this.deleteCodenamesDialog = false;
      this.selectedCodenames = null;
      this.getCodename()
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
