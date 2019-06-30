// tslint:disable
// this is an auto generated file. This will be overwritten

export const getJob = `query GetJob($id: ID!) {
  getJob(id: $id) {
    description
    numberOfDays
    hourlyRate
    hoursPerWeek
    id
    location
    pricingStructure
    remote
    title
    type
  }
}
`;
export const listJobs = `query ListJobs($filter: ModelJobFilterInput, $limit: Int, $nextToken: String) {
  listJobs(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      description
      numberOfDays
      hourlyRate
      hoursPerWeek
      id
      location
      pricingStructure
      remote
      title
      type
    }
    nextToken
  }
}
`;
