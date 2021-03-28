var DataTypes = require("sequelize").DataTypes;
var _activity_group = require("./activity_group");
var _apu = require("./apu");
var _apu_content = require("./apu_content");
var _apu_item = require("./apu_item");
var _chapter_group = require("./chapter_group");
var _content = require("./content");
var _gang_worker = require("./gang_worker");
var _item_list = require("./item_list");
var _predecessor_type = require("./predecessor_type");
var _quotation = require("./quotation");
var _quote_activity = require("./quote_activity");
var _quote_chapter = require("./quote_chapter");
var _quote_chp_grp = require("./quote_chp_grp");
var _rank = require("./rank");
var _salary = require("./salary");
var _sch_act_gang = require("./sch_act_gang");
var _schedule = require("./schedule");
var _schedule_activity = require("./schedule_activity");
var _session = require("./session");
var _user = require("./user");
var _worker = require("./worker");

function initModels(sequelize) {
  var activity_group = _activity_group(sequelize, DataTypes);
  var apu = _apu(sequelize, DataTypes);
  var apu_content = _apu_content(sequelize, DataTypes);
  var apu_item = _apu_item(sequelize, DataTypes);
  var chapter_group = _chapter_group(sequelize, DataTypes);
  var content = _content(sequelize, DataTypes);
  var gang_worker = _gang_worker(sequelize, DataTypes);
  var item_list = _item_list(sequelize, DataTypes);
  var predecessor_type = _predecessor_type(sequelize, DataTypes);
  var quotation = _quotation(sequelize, DataTypes);
  var quote_activity = _quote_activity(sequelize, DataTypes);
  var quote_chapter = _quote_chapter(sequelize, DataTypes);
  var quote_chp_grp = _quote_chp_grp(sequelize, DataTypes);
  var rank = _rank(sequelize, DataTypes);
  var salary = _salary(sequelize, DataTypes);
  var sch_act_gang = _sch_act_gang(sequelize, DataTypes);
  var schedule = _schedule(sequelize, DataTypes);
  var schedule_activity = _schedule_activity(sequelize, DataTypes);
  var session = _session(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);
  var worker = _worker(sequelize, DataTypes);

  activity_group.belongsTo(chapter_group, { foreignKey: "ID_CHP_GRP"});
  chapter_group.hasMany(activity_group, { as: "activity_groups", foreignKey: "ID_CHP_GRP"});
  apu.belongsTo(quote_activity, { foreignKey: "ID_QUO_ACT"});
  quote_activity.hasMany(apu, { as: "apus", foreignKey: "ID_QUO_ACT"});
  apu_content.belongsTo(apu, { foreignKey: "ID_APU"});
  apu.hasMany(apu_content, { as: "apu_contents", foreignKey: "ID_APU"});
  apu_content.belongsTo(content, { foreignKey: "ID_CONTENT"});
  content.hasMany(apu_content, { as: "apu_contents", foreignKey: "ID_CONTENT"});
  apu_item.belongsTo(item_list, { foreignKey: "ID_ITEM"});
  item_list.hasMany(apu_item, { as: "apu_items", foreignKey: "ID_ITEM"});
  apu_item.belongsTo(apu_content, { foreignKey: "ID_APU_CONTENT"});
  apu_content.hasMany(apu_item, { as: "apu_items", foreignKey: "ID_APU_CONTENT"});
  gang_worker.belongsTo(rank, { foreignKey: "ID_RANK"});
  rank.hasMany(gang_worker, { as: "gang_workers", foreignKey: "ID_RANK"});
  gang_worker.belongsTo(apu_item, { foreignKey: "ID_GANG"});
  apu_item.hasMany(gang_worker, { as: "gang_workers", foreignKey: "ID_GANG"});
  gang_worker.belongsTo(worker, { foreignKey: "ID_WORKER"});
  worker.hasMany(gang_worker, { as: "gang_workers", foreignKey: "ID_WORKER"});
  gang_worker.belongsTo(salary, { foreignKey: "ID_SALARY"});
  salary.hasMany(gang_worker, { as: "gang_workers", foreignKey: "ID_SALARY"});
  item_list.belongsTo(activity_group, { foreignKey: "ID_ACT_GRP"});
  activity_group.hasMany(item_list, { as: "item_lists", foreignKey: "ID_ACT_GRP"});
  item_list.belongsTo(content, { foreignKey: "ID_CONTENT"});
  content.hasMany(item_list, { as: "item_lists", foreignKey: "ID_CONTENT"});
  item_list.belongsTo(user, { foreignKey: "ID_USER"});
  user.hasMany(item_list, { as: "item_lists", foreignKey: "ID_USER"});
  quotation.belongsTo(user, { foreignKey: "ID_USER"});
  user.hasMany(quotation, { as: "quotations", foreignKey: "ID_USER"});
  quote_activity.belongsTo(quote_chapter, { foreignKey: "ID_QUO_CHP"});
  quote_chapter.hasMany(quote_activity, { as: "quote_activities", foreignKey: "ID_QUO_CHP"});
  quote_activity.belongsTo(activity_group, { foreignKey: "ID_ACT_GRP"});
  activity_group.hasMany(quote_activity, { as: "quote_activities", foreignKey: "ID_ACT_GRP"});
  quote_chapter.belongsTo(quote_chp_grp, { foreignKey: "ID_QUO_CHP_GRP"});
  quote_chp_grp.hasMany(quote_chapter, { as: "quote_chapters", foreignKey: "ID_QUO_CHP_GRP"});
  quote_chp_grp.belongsTo(chapter_group, { foreignKey: "ID_CHP_GRP"});
  chapter_group.hasMany(quote_chp_grp, { as: "quote_chp_grps", foreignKey: "ID_CHP_GRP"});
  quote_chp_grp.belongsTo(quotation, { foreignKey: "ID_QUOTE"});
  quotation.hasMany(quote_chp_grp, { as: "quote_chp_grps", foreignKey: "ID_QUOTE"});
  sch_act_gang.belongsTo(schedule_activity, { foreignKey: "ID_SCH_ACT"});
  schedule_activity.hasMany(sch_act_gang, { as: "sch_act_gangs", foreignKey: "ID_SCH_ACT"});
  sch_act_gang.belongsTo(apu_item, { as: "ID_GANG_apu_item", foreignKey: "ID_GANG"});
  apu_item.hasMany(sch_act_gang, { as: "sch_act_gangs", foreignKey: "ID_GANG"});
  schedule.belongsTo(quotation, { foreignKey: "ID_QUOTE"});
  quotation.hasMany(schedule, { as: "schedules", foreignKey: "ID_QUOTE"});
  schedule_activity.belongsTo(quote_activity, { foreignKey: "ID_QOU_ACT"});
  quote_activity.hasMany(schedule_activity, { as: "schedule_activities", foreignKey: "ID_QOU_ACT"});
  schedule_activity.belongsTo(schedule_activity, { foreignKey: "ID_PRE_ACT"});
  schedule_activity.hasMany(schedule_activity, { as: "schedule_activities", foreignKey: "ID_PRE_ACT"});
  schedule_activity.belongsTo(predecessor_type, { foreignKey: "ID_PRE_TYP"});
  predecessor_type.hasMany(schedule_activity, { as: "schedule_activities", foreignKey: "ID_PRE_TYP"});
  schedule_activity.belongsTo(schedule, { foreignKey: "ID_SCHEDULE"});
  schedule.hasMany(schedule_activity, { as: "schedule_activities", foreignKey: "ID_SCHEDULE"});
  worker.belongsTo(rank, { foreignKey: "ID_RANK"});
  rank.hasMany(worker, { as: "workers", foreignKey: "ID_RANK"});
  worker.belongsTo(user, { foreignKey: "ID_USER"});
  user.hasMany(worker, { as: "workers", foreignKey: "ID_USER"});

  return {
    activity_group,
    apu,
    apu_content,
    apu_item,
    chapter_group,
    content,
    gang_worker,
    item_list,
    predecessor_type,
    quotation,
    quote_activity,
    quote_chapter,
    quote_chp_grp,
    rank,
    salary,
    sch_act_gang,
    schedule,
    schedule_activity,
    session,
    user,
    worker,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
