<?php

/**
 * Database Configuration
 *
 * All of your system's database configuration settings go in here.
 * You can see a list of the default settings in craft/app/etc/config/defaults/db.php
 */

$production_url = parse_url(getenv('DATABASE_URL'));
$staging_url = parse_url(getenv('JAWSDB_URL'));
$local_url = parse_url(getenv('LOCAL_DATABASE_URL'));

return array(
  '*' => array(
    'tablePrefix' => 'craft',
    /* MySQL 5.7 Hack */
    'initSQLs' => array("SET SESSION sql_mode='STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';"),
    'server' => $staging_url['host'],
    'user' => $staging_url['user'],
    'password' => $staging_url['pass'],
    'database' => substr($staging_url['path'],1)
  ),/*
  '{{name}}.com' => array(
    'tablePrefix' => 'craft',
    'server' => $production_url['host'],
    'user' => $production_url['user'],
    'password' => $production_url['pass'],
    'database' => substr($production_url['path'],1)
  ),*/
  'herokuapp.com' => array(
      'tablePrefix' => 'craft',
      'server' => $staging_url['host'],
      'user' => $staging_url['user'],
      'password' => $staging_url['pass'],
      'database' => substr($staging_url['path'],1)
  ),
  'localhost' => array(
      'tablePrefix' => 'craft',
      'server' => 'r42ii9gualwp7i1y.chr7pe7iynqr.eu-west-1.rds.amazonaws.com',
      'user' => 'vu60u6okyeivcniu',
      'password' => 'k6nmor8xxmo0fznz',
      'database' => 'tw0rb1rpbe8p0uo9'
  )
);
