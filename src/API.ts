/* tslint:disable */
//  This file was automatically generated and should not be edited.

export type CreateJobInput = {
  description: string,
  numberOfDays?: number | null,
  hourlyRate?: number | null,
  hoursPerWeek?: string | null,
  id?: string | null,
  location: string,
  pricingStructure?: string | null,
  remote?: boolean | null,
  title: string,
  type: string,
};

export type UpdateJobInput = {
  description?: string | null,
  numberOfDays?: number | null,
  hourlyRate?: number | null,
  hoursPerWeek?: string | null,
  id: string,
  location?: string | null,
  pricingStructure?: string | null,
  remote?: boolean | null,
  title?: string | null,
  type?: string | null,
};

export type DeleteJobInput = {
  id?: string | null,
};

export type ModelJobFilterInput = {
  description?: ModelStringFilterInput | null,
  numberOfDays?: ModelIntFilterInput | null,
  hourlyRate?: ModelIntFilterInput | null,
  hoursPerWeek?: ModelStringFilterInput | null,
  id?: ModelIDFilterInput | null,
  location?: ModelStringFilterInput | null,
  pricingStructure?: ModelStringFilterInput | null,
  remote?: ModelBooleanFilterInput | null,
  title?: ModelStringFilterInput | null,
  type?: ModelStringFilterInput | null,
  and?: Array< ModelJobFilterInput | null > | null,
  or?: Array< ModelJobFilterInput | null > | null,
  not?: ModelJobFilterInput | null,
};

export type ModelStringFilterInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export type ModelIntFilterInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  contains?: number | null,
  notContains?: number | null,
  between?: Array< number | null > | null,
};

export type ModelIDFilterInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export type ModelBooleanFilterInput = {
  ne?: boolean | null,
  eq?: boolean | null,
};

export type CreateJobMutationVariables = {
  input: CreateJobInput,
};

export type CreateJobMutation = {
  createJob:  {
    __typename: "Job",
    description: string,
    numberOfDays: number | null,
    hourlyRate: number | null,
    hoursPerWeek: string | null,
    id: string,
    location: string,
    pricingStructure: string | null,
    remote: boolean | null,
    title: string,
    type: string,
  } | null,
};

export type UpdateJobMutationVariables = {
  input: UpdateJobInput,
};

export type UpdateJobMutation = {
  updateJob:  {
    __typename: "Job",
    description: string,
    numberOfDays: number | null,
    hourlyRate: number | null,
    hoursPerWeek: string | null,
    id: string,
    location: string,
    pricingStructure: string | null,
    remote: boolean | null,
    title: string,
    type: string,
  } | null,
};

export type DeleteJobMutationVariables = {
  input: DeleteJobInput,
};

export type DeleteJobMutation = {
  deleteJob:  {
    __typename: "Job",
    description: string,
    numberOfDays: number | null,
    hourlyRate: number | null,
    hoursPerWeek: string | null,
    id: string,
    location: string,
    pricingStructure: string | null,
    remote: boolean | null,
    title: string,
    type: string,
  } | null,
};

export type GetJobQueryVariables = {
  id: string,
};

export type GetJobQuery = {
  getJob:  {
    __typename: "Job",
    description: string,
    numberOfDays: number | null,
    hourlyRate: number | null,
    hoursPerWeek: string | null,
    id: string,
    location: string,
    pricingStructure: string | null,
    remote: boolean | null,
    title: string,
    type: string,
  } | null,
};

export type ListJobsQueryVariables = {
  filter?: ModelJobFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListJobsQuery = {
  listJobs:  {
    __typename: "ModelJobConnection",
    items:  Array< {
      __typename: "Job",
      description: string,
      numberOfDays: number | null,
      hourlyRate: number | null,
      hoursPerWeek: string | null,
      id: string,
      location: string,
      pricingStructure: string | null,
      remote: boolean | null,
      title: string,
      type: string,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type OnCreateJobSubscription = {
  onCreateJob:  {
    __typename: "Job",
    description: string,
    numberOfDays: number | null,
    hourlyRate: number | null,
    hoursPerWeek: string | null,
    id: string,
    location: string,
    pricingStructure: string | null,
    remote: boolean | null,
    title: string,
    type: string,
  } | null,
};

export type OnUpdateJobSubscription = {
  onUpdateJob:  {
    __typename: "Job",
    description: string,
    numberOfDays: number | null,
    hourlyRate: number | null,
    hoursPerWeek: string | null,
    id: string,
    location: string,
    pricingStructure: string | null,
    remote: boolean | null,
    title: string,
    type: string,
  } | null,
};

export type OnDeleteJobSubscription = {
  onDeleteJob:  {
    __typename: "Job",
    description: string,
    numberOfDays: number | null,
    hourlyRate: number | null,
    hoursPerWeek: string | null,
    id: string,
    location: string,
    pricingStructure: string | null,
    remote: boolean | null,
    title: string,
    type: string,
  } | null,
};
