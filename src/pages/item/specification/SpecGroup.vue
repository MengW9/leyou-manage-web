<template>
    <div>
      <v-data-table
      :headers="headers"
      :items="groups"
      hide-actions
      class="elevation-0"
      >
        <template slot="items" slot-scope="props">
          <tr @click="selectGroup(props.item)">
            <td class="text-xs-center">{{props.item.id}}</td>
            <td class="text-xs-center">{{props.item.name}}</td>
            <td class="justify-center layout px-0">
              <v-btn icon @click.stop="editGroup(props.item)">
                <i class="el-icon-edit"/>
              </v-btn>
              <v-btn icon @click.stop="deleteGroup(props.item.id)">
                <i class="el-icon-delete"/>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </div>
</template>

<script>
    export default {
        name: "Specification"
    }
</script>

<style scoped>

</style>
