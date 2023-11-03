import http from 'k6/http';
import { check, sleep } from 'k6';
import { studentUrl, teacherUrl } from './common.js';

export let options = {
  vus: 10,
  duration: '30s',
};

export default function () {
  let studentResponse = http.get(studentUrl);
  let teacherResponse = http.get(teacherUrl);

  check(studentResponse, {
    'Student Request Status is 200': (r) => r.status === 200,
  });
  check(teacherResponse, {
    'Teacher Request Status is 200': (r) => r.status === 200,
  });

  sleep(1);
}