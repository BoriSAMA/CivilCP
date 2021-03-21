SELECT `item_list`.`ID`, `item_list`.`NAME`, `item_list`.`MEASSURE_UNIT`, `item_list`.`PERFORMANCE`, `item_list`.`DESCRIPTION`, `item_list`.`COST`, `item_list`.`ID_ACT_GRP`, `item_list`.`ID_CONTENT`, `item_list`.`ID_USER`, `user`.`ID` AS `user.ID`, `user`.`SUPERUSER` AS `user.SUPERUSER` FROM `item_list` AS `item_list` LEFT OUTER JOIN `user` AS `user` ON `item_list`.`ID_USER` = `user`.`ID` WHERE (`item_list`.`ID_CONTENT` = 4 AND `item_list`.`ID_ACT_GRP` = 5 AND (`item_list`.`ID_USER` = 28 OR `user`.`SUPERUSER` = 1));

SELECT sum(`TOTAL`) AS `sum` 
FROM `quote_activity` AS `quote_activity` LEFT OUTER JOIN ( `quote_chapter` AS `quote_chapter` INNER JOIN `quote_chp_grp` AS `quote_chapter->quote_chp_grp` ON `quote_chapter`.`ID_QUO_CHP_GRP` = `quote_chapter->quote_chp_grp`.`ID` AND `quote_chapter->quote_chp_grp`.`ID_QUOTE` = '4' ) ON `quote_activity`.`ID_QUO_CHP` = `quote_chapter`.`ID` GROUP BY `quote_chapter->quote_chp_grp`.`ID_QUOTE`