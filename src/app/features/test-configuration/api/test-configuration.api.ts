import { GetTestTypeDetailsRequest } from "../models/test-configuration";

const TestConfigurationAPI = {
  create: "test-type",
  getPagination: "test-type",
  getDetail: (filter: GetTestTypeDetailsRequest) => {
    filter.categorySkillId = filter.categorySkillId.toString();
    return "test-type/detail?" + new URLSearchParams(filter as any).toString();
  },
  update: "test-type",
  delete: "test-type"
}

export default TestConfigurationAPI;