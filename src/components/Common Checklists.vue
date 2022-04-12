<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <Toast/>

        <Toolbar class="mb-4">

          <template v-slot:start>
            <div class="my-2">
              <Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
              <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedccls || !selectedccls.length" />
            </div>
          </template>

          <template v-slot:end>
            <FileUpload mode="basic" name="demo[]" :auto="true" url="upload" :maxFileSize="1000000" label="Import" chooseLabel="Import"  class="mr-2 inline-block" />
            <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)"  />
          </template>

        </Toolbar>

        <DataTable ref="dt" :value="cclList" v-model:selection="selectedccls" dataKey="_id" :paginator="true" :rows="10" :filters="filters"
                   paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25,50]"
                   currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Records" responsiveLayout="scroll">

          <template #header>
            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
              <h5 class="m-0">Common Checklists</h5>
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

          <Column field="family" header="Family"  >
            <template #body="slotProps">
              <span class="p-column-title">Family</span>
              {{slotProps.data.family}}
            </template>
          </Column>

          <Column field="keyword" header="Keyword"  >
            <template #body="slotProps">
              <span class="p-column-title">Keyword</span>
              {{slotProps.data.keyword}}
            </template>
          </Column>

          <Column field="checklist" header="Checklist"  >
            <template #body="slotProps">
              <span class="p-column-title">Checklist</span>
              <ScrollPanel style=" height: 100px; white-space: pre-wrap" class="custombar1">
                <p>
                  {{slotProps.data.checklist}}
                </p>
              </ScrollPanel>

            </template>
          </Column>


          <Column field="tag" header="Tag"  >
            <template #body="slotProps">
              <span class="p-column-title">Tag</span>
<!--              <span>{{slotProps.data.tag}}</span>-->
              <span class="p-tag p-tag-info" v-for="t of slotProps.data.tag" style="margin: 5px">{{t}}</span>
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
              <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editccl(slotProps.data)" />
              <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteccl(slotProps.data)" />
            </template>
          </Column>
        </DataTable>



        <Dialog v-model:visible="cclDialog" :style="{width: '1050px'}" header="Checklist Detail" :modal="true" class="p-fluid" >


          <div class="field">
            <H5 for="family">family</H5>
            <InputText id="family"  v-model.trim="newccl.family" required="true" autofocus :class="{'p-invalid': submitted && !newccl.family}" />
            <InlineMessage class="p-invalid" v-if="submitted && !newccl.family" >Device Family is required.</InlineMessage>
          </div>


          <div class="field">
            <H5 for="codename">Keyword</H5>
            <InputText id="codename" v-model="newccl.keyword" required="true" rows="3" cols="20" />
            <InlineMessage class="p-invalid" v-if="submitted && !newccl.keyword">Keyword is required.</InlineMessage>
          </div>

          <div class="field" style="margin-top: 10px">
            <H5 >Device Family</H5>
            <div class="p-field-radiobutton">
              <RadioButton id="family1" name="family" value="Nexus 2000" v-model="newccl.family" />
              <label for="family1" style="margin-right: 50px">Nexus 2000</label>
              <RadioButton id="family2" name="family" value="Nexus 3000" v-model="newccl.family" />
              <label for="family2" style="margin-right: 50px">Nexus 3000</label>
              <RadioButton id="family3" name="family" value="Nexus 5000/5500" v-model="newccl.family" />
              <label for="family3" style="margin-right: 50px">Nexus 5000/5500</label>
            </div>

            <div class="p-field-radiobutton" style="margin-top: 10px">
              <RadioButton id="family4" name="family" value="Nexus 5600/6000" v-model="newccl.family" />
              <label for="family4" style="margin-right: 50px">Nexus 5600/6000</label>
              <RadioButton id="family5" name="family" value="Nexus 7000/7700" v-model="newccl.family" />
              <label for="family5" style="margin-right: 50px">Nexus 7000/7700</label>
              <RadioButton id="family6" name="family" value="Nexus 9000" v-model="newccl.family" />
              <label for="family6">Nexus 9000</label>

            </div>
            <InlineMessage class="p-invalid" v-if="submitted && !newccl.family" >Device Family is required.</InlineMessage>
          </div>
          <divider></divider>


          <div class="field">
            <H5 for="checklist">Checklist</H5>
            <InputText id="Description" v-model="newccl.checklist" required="true" rows="3" cols="20" />
            <InlineMessage class="p-invalid" v-if="submitted && !newccl.checklist">Checklist is required.</InlineMessage>
          </div>


          <divider></divider>

          <H5 for="tag">Tag</H5>
          <div v-for="(item, index) in newccl.tag" :key="item.key">

            <InputText v-model="item.tagname" placeholder="Tag"  ></InputText>
            <Button style="margin: 10px" label="Remove Tag" icon="pi pi-times" class="p-button-text" @click.prevent="removeDomain(item)"></Button>
            <divider></divider>

          </div>

          <template #footer>
            <Button label="Add Tag" icon="pi pi-plus-circle" class="p-button-text" @click="addDomain"/>
            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
            <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveccl" />
          </template>
        </Dialog>




        <Dialog v-model:visible="deletecclDialog" :style="{width: '450px'}" header="Confirm" :modal="true" >
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span >Are you sure you want to delete ?</span>
          </div>
          <template #footer>
            <Button label="No" icon="pi pi-times" class="p-button-text" @click="deletecclDialog = false"/>
            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteccl" />
          </template>
        </Dialog>



        <Dialog v-model:visible="deletecclsDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="cclList">Are you sure you want to delete the selected products?</span>
          </div>
          <template #footer>
            <Button label="No" icon="pi pi-times" class="p-button-text" @click="deletecclsDialog = false"/>
            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedccls" />
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

      cclList: null,
      loading1: true,
      cclDialog: false,
      newccl: {
        tag:[{tagname:''}],

      },

      deletecclDialog: false,
      deletecclsDialog: false,
      selectedccls: null,

      filters: {},
      submitted: false,



    }
  },


  created() {

    this.getccl();

    this.initFilters();
  },



  methods: {

    getccl(){
      axios.get('/api/gchecklists').then(res=>{
        this.cclList=res.data
        this.loading1=false
      }).catch(err=>console.log(err));
    },

    dateFormatter (datetime) {

      return moment(datetime).format("YYYY-MM-DD HH:mm:ss")
    },

    addDomain() {
      this.newccl.tag.push({
        tagname: '',
      });
    },


    removeDomain(item) {
      var index = this.newccl.tag.indexOf(item)
      if (index !== -1) {
        this.newccl.tag.splice(index, 1)
      }
    },

    openNew() {
      this.ccllist = {};
      this.submitted = false;
      this.cclDialog = true;
    },


    hideDialog() {
      this.cclDialog = false;
      this.submitted = false;
    },

    saveccl() {
      this.submitted = true;


      if (this.newccl.family.trim()) {
        if (this.newccl._id) {


          axios.post(`api/gchecklists/editgcl/${this.newccl._id}`, this.newccl)
              .then(res=>{
                this.$toast.add({severity:'success', summary: 'Successful', detail: 'OID Updated', life: 3000});
              })
              .catch(err=>{
                this.$toast.add({severity:'error', summary: '提交失败', detail:'提交失败', life: 3000});
              })
        }
        else {

          axios.post(`api/gchecklists/addgcl`, this.newccl)
              .then(res=>{
                this.$toast.add({severity:'success', summary: 'Successful', detail: 'OID Created', life: 3000});
              })
              .catch(err=>{
                this.$toast.add({severity:'error', summary: '提交失败', detail:'提交失败', life: 3000});
              })
        }
        this.cclDialog = false;
        this.newccl = {};
        this.getccl()

      }
    },


    editccl(val) {

      this.newccl = {...val};
      this.cclDialog = true;
    },


    confirmDeleteccl(val) {

      this.newccl = val;
      this.deletecclDialog = true;
    },

    deleteccl() {

      axios.delete(`api/gchecklists/delgcl/${this.newccl._id}`, this.newccl)
          .then(res=>{
            this.$toast.add({severity:'success', summary: 'Successful', detail: 'OID Removed', life: 3000});
          })
          .catch(err=>{
            this.$toast.add({severity:'error', summary: '提交失败', detail:'提交失败', life: 3000});
          })
      this.deletecclDialog = false;
      this.newccl = {};
      this.getccl()

    },



    confirmDeleteSelected() {

      this.deletecclsDialog = true;
    },
    deleteSelectedccls() {


      for(let num = 0 ; num < this.selectedccls.length;num++){

        axios.delete(`api/gchecklists/delgcl/${this.selectedccls[num]._id}`, this.selectedccls[num])
            .then(res=>{
              this.$toast.add({severity:'success', summary: 'Successful', detail: 'OIDs Removed', life: 3000});
            })
            .catch(err=>{
              this.$toast.add({severity:'error', summary: '提交失败', detail:'提交失败', life: 3000});
            })

      }

      this.deletecclsDialog = false;
      this.selectedccls = null;
      this.getccl()
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
