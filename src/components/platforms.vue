<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <Toast/>

        <Toolbar class="mb-4">

          <template v-slot:start>
            <div class="my-2">
              <Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
              <Button label="Delete" icon="pi pi-trash" class="p-button-danger mr-2" @click="confirmDeleteSelected" :disabled="!selectedptfs || !selectedptfs.length" />
              <Button icon="pi pi-plus" class="p-button-success mr-2" label="Expand All" @click="expandAll"  />
              <Button icon="pi pi-minus" class="p-button-danger mr-2" label="Collapse All" @click="collapseAll" />
            </div>
          </template>

          <template v-slot:end>
            <FileUpload mode="basic" name="demo[]" :auto="true" url="upload" :maxFileSize="1000000" label="Import" chooseLabel="Import"  class="mr-2 inline-block" />
            <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)"  />
          </template>

        </Toolbar>


        <DataTable ref="dt" v-model:expandedRows="expandedRows" :value="ptfList" v-model:selection="selectedptfs" dataKey="_id" :paginator="true" :rows="10" :filters="filters"
                   paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25,50]"
                   currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" responsiveLayout="scroll">

          <template #header>
            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
              <h5 class="m-0"> Platform Info </h5>

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

          <Column :expander="true" headerStyle="width: 3rem" />

          <Column field="pid" header="PID"  >
            <template #body="slotProps">
              <span class="p-column-title"> PID </span>
              {{slotProps.data.pid}}
            </template>
          </Column>

          <Column field="family" header="Family"  >
            <template #body="slotProps">
              <span class="p-column-title">Family</span>
              {{slotProps.data.family}}
            </template>
          </Column>

          <Column field="asicname" header="Asicname"  >
            <template #body="slotProps">
              <span class="p-column-title">Asicname</span>
              {{slotProps.data.asicname}}
            </template>
          </Column>

          <Column field="desc" header="Description"  >
            <template #body="slotProps">
              <span class="p-column-title">desc</span>
              {{slotProps.data.desc}}
            </template>
          </Column>

          <Column field="codename" header="Codename"  >
            <template #body="slotProps">
              <span class="p-column-title">Codename</span>
              {{slotProps.data.codename}}
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
              <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editptf(slotProps.data)" />
              <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteptf(slotProps.data)" />
            </template>
          </Column>



          <template #expansion="slotProps" :data1="gcList">
            <div class="p-3">

              <h5>General Checklists</h5>
              <div v-for="(item,index) in gcList">
              <Accordion :multiple="true" :activeIndex="[]">
                <AccordionTab  :header="item.keyword" v-if="slotProps.data.family === item.family">
                  <div style="white-space: pre-wrap;">{{item.checklist}}
                  </div>

                </AccordionTab>
              </Accordion>
              </div>

              <h5>Specific Checklists</h5>
              <Accordion :multiple="true" :activeIndex="[]">
                <AccordionTab  v-for="(item,index) of slotProps.data.troubleshoot" :header=item.keywords>
                  <div style="white-space: pre-wrap;">{{item.checklist}}</div>
                </AccordionTab>
              </Accordion>

              <h5>Specific Checklists</h5>

                <div  v-for="(item,index) of slotProps.data.refdoc.split(',')">
                 <P>{{ "\n"+(index+1) +". "+item+"\n" }}</P>
                </div>

            </div>
          </template>
        </DataTable>


        <Dialog v-model:visible="ptfDialog" :style="{width: '1050px'}" header="Platform Detail" :modal="true" class="p-fluid" >


          <div class="field">
            <H5 for="pid">PID</H5>
            <InputText id="pid"  v-model.trim="newptf.pid" required="true" autofocus :class="{'p-invalid': submitted && !newptf.pid}" />
            <InlineMessage class="p-invalid" v-if="submitted && !newptf.family" >Device Family is required.</InlineMessage>
          </div>


          <div class="field">
            <H5 for="codename">Codename</H5>
            <InputText id="codename" v-model="newptf.codename" required="true" rows="3" cols="20" />
            <InlineMessage class="p-invalid" v-if="submitted && !newptf.codename">Codename is required.</InlineMessage>
          </div>

          <div class="field" style="margin-top: 10px">
            <H5 >Device Family</H5>
            <div class="p-field-radiobutton">
              <RadioButton id="family1" name="family" value="Nexus 2000" v-model="newptf.family" />
              <label for="family1" style="margin-right: 50px">Nexus 2000</label>
              <RadioButton id="family2" name="family" value="Nexus 3000" v-model="newptf.family" />
              <label for="family2" style="margin-right: 50px">Nexus 3000</label>
              <RadioButton id="family3" name="family" value="Nexus 5000/5500" v-model="newptf.family" />
              <label for="family3" style="margin-right: 50px">Nexus 5000/5500</label>
            </div>

              <div class="p-field-radiobutton" style="margin-top: 10px">
              <RadioButton id="family4" name="family" value="Nexus 5600/6000" v-model="newptf.family" />
              <label for="family4" style="margin-right: 50px">Nexus 5600/6000</label>
              <RadioButton id="family5" name="family" value="Nexus 7000/7700" v-model="newptf.family" />
              <label for="family5" style="margin-right: 50px">Nexus 7000/7700</label>
              <RadioButton id="family6" name="family" value="Nexus 9000" v-model="newptf.family" />
              <label for="family6">Nexus 9000</label>

            </div>
            <InlineMessage class="p-invalid" v-if="submitted && !newptf.family" >Device Family is required.</InlineMessage>
          </div>
          <divider></divider>

          <div class="field" style="margin-top: 10px">
            <H5 >Asic Family</H5>
            <div class="p-field-radiobutton">
              <p>N5K/N6K</p>
              <RadioButton id="asicname1" name="asicname" value="Bigsur" v-model="newptf.asicname" />
              <label for="asicname1" style="margin-right: 50px">Bigsur</label>
              <RadioButton id="asicname2" name="asicname" value="Carmel" v-model="newptf.asicname" />
              <label for="asicname2" style="margin-right: 50px">Carmel</label>
              <RadioButton id="asicname3" name="asicname" value="Gatos" v-model="newptf.asicname" />
              <label for="asicname3" style="margin-right: 50px">Gatos</label>
            </div>
            <divider></divider>
            <div class="p-field-radiobutton" style="margin-top: 10px">
              <P>N2K</P>
              <RadioButton id="asicname4" name="asicname" value="redwood" v-model="newptf.asicname" />
              <label for="asicname4" style="margin-right: 50px">redwood</label>
              <RadioButton id="asicname5" name="asicname" value="portola" v-model="newptf.asicname" />
              <label for="asicname5" style="margin-right: 50px">portola</label>
              <RadioButton id="asicname6" name="asicname" value="woodside" v-model="newptf.asicname" />
              <label for="asicname6" style="margin-right: 50px">woodside</label>
              <RadioButton id="asicname7" name="asicname" value="princeton" v-model="newptf.asicname" />
              <label for="asicname7" style="margin-right: 50px">princeton</label>
              <RadioButton id="asicname8" name="asicname" value="tiburon" v-model="newptf.asicname" />
              <label for="asicname8" style="margin-right: 50px">tiburon</label>
            </div>
            <divider></divider>
            <div class="p-field-radiobutton" style="margin-top: 10px">
              <p>N7K</p>
              <RadioButton id="asicname9" name="asicname" value="Starlifterc" v-model="newptf.asicname" />
              <label for="asicname9" style="margin-right: 50px">Starlifterc</label>
              <RadioButton id="asicname11" name="asicname" value="Flanker" v-model="newptf.asicname" />
              <label for="asicname11" style="margin-right: 50px">Flanker</label>
              <RadioButton id="asicname12" name="asicname" value="ClipperCR" v-model="newptf.asicname" />
              <label for="asicname12" style="margin-right: 50px">ClipperCR</label>
              <RadioButton id="asicname13" name="asicname" value="EARL8" v-model="newptf.asicname" />
              <label for="asicname13" style="margin-right: 50px">EARL8</label>
              <RadioButton id="asicname14" name="asicname" value="Orion" v-model="newptf.asicname" />
              <label for="asicname14" style="margin-right: 50px">Orion</label>
            </div>

            <divider></divider>

            <div class="p-field-radiobutton" style="margin-top: 10px">
              <p>N3K/N9K</p>
              <RadioButton id="asicname15" name="asicname" value="T2" v-model="newptf.asicname" />
              <label for="asicname15" style="margin-right: 50px">T2</label>
              <RadioButton id="asicname16" name="asicname" value="T+" v-model="newptf.asicname" />
              <label for="asicname16" style="margin-right: 50px">T+</label>
              <RadioButton id="asicname17" name="asicname" value="T2+" v-model="newptf.asicname" />
              <label for="asicname17" style="margin-right: 50px">T2+</label>
              <RadioButton id="asicname18" name="asicname" value="T3" v-model="newptf.asicname" />
              <label for="asicname18" style="margin-right: 50px">T3</label>
              <RadioButton id="asicname19" name="asicname" value="Appalachia-Wolfridge" v-model="newptf.asicname" />
              <label for="asicname19" style="margin-right: 50px">Appalachia-Wolfridge</label>
            </div>


            <div class="p-field-radiobutton" style="margin-top: 10px">
              <RadioButton id="asicname21" name="asicname" value="Rocky-Homewooc" v-model="newptf.asicname" />
              <label for="asicname21" style="margin-right: 50px">Rocky-Homewooc</label>
              <RadioButton id="asicname22" name="asicname" value="Rocky-Heavenly" v-model="newptf.asicname" />
              <label for="asicname22" style="margin-right: 50px">Rocky-Heavenly</label>
              <RadioButton id="asicname23" name="asicname" value="Rocky-BigSky" v-model="newptf.asicname" />
              <label for="asicname23" style="margin-right: 50px">Rocky-BigSky</label>
              <RadioButton id="asicname24" name="asicname" value="Tahoe-Davos" v-model="newptf.asicname" />
              <label for="asicname24" style="margin-right: 50px">Tahoe-Davos</label>
            </div>



            <div class="p-field-radiobutton" style="margin-top: 10px">
              <RadioButton id="asicname25" name="asicname" value="Tahoe-Lacrosse" v-model="newptf.asicname" />
              <label for="asicname25" style="margin-right: 50px">Tahoe-Lacrosse</label>
              <RadioButton id="asicname26" name="asicname" value="Tahoe-Sugarbowl" v-model="newptf.asicname" />
              <label for="asicname26" style="margin-right: 50px">Tahoe-Sugarbowl</label>
              <RadioButton id="asicname27" name="asicname" value="Fretta-Jericho" v-model="newptf.asicname" />
              <label for="asicname27" style="margin-right: 50px">Fretta-Jericho</label>
              <RadioButton id="asicname28" name="asicname" value="Tomahawk" v-model="newptf.asicname" />
              <label for="asicname28" style="margin-right: 50px">Tomahawk</label>
              <RadioButton id="asicname29" name="asicname" value="Innovium-Teralynx" v-model="newptf.asicname" />
              <label for="asicname29" style="margin-right: 50px">Innovium-Teralynx</label>

            </div>


            <div class="p-field-radiobutton" style="margin-top: 10px">
              <RadioButton id="asicname31" name="asicname" value="Barefoot-Tofino" v-model="newptf.asicname" />
              <label for="asicname31" style="margin-right: 50px">Barefoot-Tofino</label>
              <RadioButton id="asicname32" name="asicname" value="Monticello" v-model="newptf.asicname" />
              <label for="asicname32" style="margin-right: 50px">Monticello</label>
              <RadioButton id="asicname33" name="asicname" value="Sundown" v-model="newptf.asicname" />
              <label for="asicname33" style="margin-right: 50px">Sundown</label>
              <RadioButton id="asicname34" name="asicname" value="QuadPeaks" v-model="newptf.asicname" />
              <label for="asicname34" style="margin-right: 50px">QuadPeaks</label>

            </div>
            <divider></divider>
            <div class="p-field-radiobutton" style="margin-top: 10px">
              <RadioButton id="asicname35" name="asicname" value="NA" v-model="newptf.asicname" />
              <label for="asicname35" style="margin-right: 50px">NA</label>
            </div>
            <InlineMessage class="p-invalid" v-if="submitted && !newptf.family" >Device Family is required.</InlineMessage>

          </div>


          <div class="field">
            <H5 for="Description">Description</H5>
            <InputText id="Description" v-model="newptf.desc" required="true" rows="3" cols="20" />
            <InlineMessage class="p-invalid" v-if="submitted && !newptf.desc">Description is required.</InlineMessage>
          </div>

          <div class="field">
            <H5 for="Reference Doc">Reference Doc</H5>
            <InputText id="Reference Doc" v-model="newptf.refdoc" required="true" rows="3" cols="20" />
          </div>

          <divider></divider>

          <H5 for="Specific Checklists">Specific Checklists</H5>
          <div v-for="(item, index) in newptf.troubleshoot" :key="item.key">

              <InputText v-model="item.keywords" placeholder="请输入keywords"  ></InputText>

              <InputText v-model="item.checklist" placeholder="请输入Specific Checklists" type="textarea" ></InputText>

              <Button style="margin: 10px" label="Remove TS Areas" icon="pi pi-times" class="p-button-text" @click.prevent="removeDomain(item)"></Button>
            <divider></divider>

          </div>

          <template #footer>
            <Button label="Add TS Areas" icon="pi pi-plus-circle" class="p-button-text" @click="addDomain"/>
            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
            <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveptf" />
          </template>
        </Dialog>







        <Dialog v-model:visible="deleteptfDialog" :style="{width: '450px'}" header="Confirm" :modal="true" >
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="ptfList">Are you sure you want to delete <b>{{ptfList.ptf}}</b>?</span>
          </div>
          <template #footer>
            <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteptfDialog = false"/>
            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteptf" />
          </template>
        </Dialog>



        <Dialog v-model:visible="deleteptfsDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="ptfList">Are you sure you want to delete the selected products?</span>
          </div>
          <template #footer>
            <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteptfsDialog = false"/>
            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedptfs" />
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

      ptfList: null,
      gcList: null,
      loading1: true,
      ptfDialog: false,
      newptf: {
        troubleshoot:[{keywords:'',checklist:''}],
      },

      deleteptfDialog: false,
      deleteptfsDialog: false,
      selectedptfs: null,

      filters: {},
      submitted: false,
      active: 0,


      expandedRows: [],



    }
  },


  created() {

    this.getptf();
    this.getgchecklist();
    this.initFilters();
  },



  methods: {

    getptf(){
      axios.get('/api/platforms').then(res=>{
        this.ptfList=res.data
        this.loading1=false
      }).catch(err=>console.log(err));
    },
    getgchecklist(){
      axios.get('/api/gchecklists').then(res=>{
            this.gcList = res.data;
          }
      ).catch(err=>console.log(err));

    },

    removeDomain(item) {
      var index = this.newptf.troubleshoot.indexOf(item)
      if (index !== -1) {
        this.newptf.troubleshoot.splice(index, 1)
      }
    },

    addDomain() {
      this.newptf.troubleshoot.push({
        keywords: '',
        checklist: ''
      });
    },

    dateFormatter (datetime) {

      return moment(datetime).format("YYYY-MM-DD HH:mm:ss")
    },


    expandAll() {
      this.expandedRows = this.ptfList.filter(p => p._id);
    },
    collapseAll() {
      this.expandedRows = null;
    },


    openNew() {
      this.ptflist = {};
      this.submitted = false;
      this.ptfDialog = true;
    },


    hideDialog() {
      this.ptfDialog = false;
      this.submitted = false;
    },

    saveptf() {
      this.submitted = true;


      if (this.newptf.pid.trim()) {
        if (this.newptf._id) {

          console.log(this.newptf.refdoc)

          axios.post(`api/platforms/editplatform/${this.newptf._id}`, this.newptf)
              .then(res=>{
                this.$toast.add({severity:'success', summary: 'Successful', detail: 'OID Updated', life: 3000});
              })
              .catch(err=>{
                this.$toast.add({severity:'error', summary: '提交失败', detail:'提交失败', life: 3000});
              })
        }
        else {

          axios.post(`api/platforms/addplatform`, this.newptf)
              .then(res=>{
                this.$toast.add({severity:'success', summary: 'Successful', detail: 'OID Created', life: 3000});
              })
              .catch(err=>{
                this.$toast.add({severity:'error', summary: '提交失败', detail:'提交失败', life: 3000});
              })
        }
        this.ptfDialog = false;
        this.newptf = {};
        this.getptf()

      }
    },


    editptf(val) {

      this.newptf = {...val};
      this.ptfDialog = true;
    },


    confirmDeleteptf(val) {


      this.newptf = val;
      this.deleteptfDialog = true;
    },
    deleteptf() {

      axios.delete(`api/platforms/delplatform/${this.newptf._id}`, this.newptf)
          .then(res=>{
            this.$toast.add({severity:'success', summary: 'Successful', detail: 'OID Removed', life: 3000});
          })
          .catch(err=>{
            this.$toast.add({severity:'error', summary: '提交失败', detail:'提交失败', life: 3000});
          })
      this.deleteptfDialog = false;
      this.newptf = {};
      this.getptf()

    },



    confirmDeleteSelected() {

      this.deleteptfsDialog = true;
    },
    deleteSelectedptfs() {


      for(let num = 0 ; num < this.selectedptfs.length;num++){

        axios.delete(`api/platforms/delplatform/${this.selectedptfs[num]._id}`, this.selectedptfs[num])
            .then(res=>{
              this.$toast.add({severity:'success', summary: 'Successful', detail: 'OIDs Removed', life: 3000});
            })
            .catch(err=>{
              this.$toast.add({severity:'error', summary: '提交失败', detail:'提交失败', life: 3000});
            })

      }

      this.deleteptfsDialog = false;
      this.selectedptfs = null;
      this.getptf()
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

.accordion-custom {
  i, span {
    vertical-align: middle;
  }

  span {
    margin: 0 .5rem;
  }
}
</style>
