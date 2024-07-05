const { coreLogic } = require('../coreLogic');
const { namespaceWrapper, _server } = require('@_koii/namespace-wrapper');
const Joi = require('joi');
const axios = require('axios');
beforeAll(async () => {
  await namespaceWrapper.defaultTaskSetup();
});

describe('Performing the task', () => {
  it('should performs the core logic task', async () => {
    const round = 1;
    const result = await coreLogic.task(round);
    expect(result).not.toContain('ERROR IN EXECUTING TASK');
  });

  it('should make the submission to k2 for dummy round 1', async () => {
    const round = 1;
    await coreLogic.submitTask(round);
    const taskState = await namespaceWrapper.getTaskState();
    const schema = Joi.object()
      .pattern(
        Joi.string(),
        Joi.object().pattern(
          Joi.string(),
          Joi.object({
            submission_value: Joi.string().required(),
            slot: Joi.number().integer().required(),
            round: Joi.number().integer().required(),
          }),
        ),
      )
      .required()
      .min(1);
    const validationResult = schema.validate(taskState.submissions);
    try {
      expect(validationResult.error).toBeUndefined();
    } catch (e) {
      throw new Error("Submission doesn't exist or is incorrect");
    }
  });

  it('should make the make an audit on submission', async () => {
    const round = 1;
    await coreLogic.auditTask(round);
    const taskState = await namespaceWrapper.getTaskState();
    console.log('audit task', taskState.submissions_audit_trigger);
    const schema = Joi.object()
      .pattern(
        Joi.string(),
        Joi.object().pattern(
          Joi.string(),
          Joi.object({
            trigger_by: Joi.string().required(),
            slot: Joi.number().integer().required(),
            votes: Joi.array().required(),
          }),
        ),
      )
      .required();
    const validationResult = schema.validate(
      taskState.submissions_audit_trigger,
    );
    try {
      expect(validationResult.error).toBeUndefined();
    } catch (e) {
      throw new Error('Submission audit is incorrect');
    }
  });
  it('should make the distribution submission to k2 for dummy round 1', async () => {
    const round = 1;
    //await coreLogic.submitDistributionList(round);
    const task = require('../task');
    await task.distribution.submitDistributionList(round);
    const taskState = await namespaceWrapper.getTaskState();
    const schema = Joi.object()
      .pattern(
        Joi.string(),
        Joi.object().pattern(
          Joi.string(),
          Joi.object({
            submission_value: Joi.string().required(),
            slot: Joi.number().integer().required(),
            round: Joi.number().integer().required(),
          }),
        ),
      )
      .required()
      .min(1);
    console.log(taskState.distribution_rewards_submission);
    const validationResult = schema.validate(
      taskState.distribution_rewards_submission,
    );
    try {
      expect(validationResult.error).toBeUndefined();
    } catch (e) {
      throw new Error("Distribution submission doesn't exist or is incorrect");
    }
  });
  it('should make the make an audit on distribution submission', async () => {
    const round = 1;
    await coreLogic.auditDistribution(round);
    const taskState = await namespaceWrapper.getTaskState();
    console.log('audit task', taskState.distributions_audit_trigger);
    const schema = Joi.object()
      .pattern(
        Joi.string(),
        Joi.object().pattern(
          Joi.string(),
          Joi.object({
            trigger_by: Joi.string().required(),
            slot: Joi.number().integer().required(),
            votes: Joi.array().required(),
          }),
        ),
      )
      .required();
    const validationResult = schema.validate(
      taskState.distributions_audit_trigger,
    );
    try {
      expect(validationResult.error).toBeUndefined();
    } catch (e) {
      throw new Error('Distribution audit is incorrect');
    }
  });

  it('should make sure the submitted distribution list is valid', async () => {
    const round = 1;
    const distributionList = await namespaceWrapper.getDistributionList(
      null,
      round,
    );
    console.log(
      'Generated distribution List',
      JSON.parse(distributionList.toString()),
    );
    const schema = Joi.object()
      .pattern(Joi.string().required(), Joi.number().integer().required())
      .required();
    const validationResult = schema.validate(
      JSON.parse(distributionList.toString()),
    );
    console.log(validationResult);
    try {
      expect(validationResult.error).toBeUndefined();
    } catch (e) {
      throw new Error('Submitted distribution list is not valid');
    }
  });

  it('should test the endpoint', async () => {
    const response = await axios.get('http://localhost:10000');
    expect(response.status).toBe(200);
    expect(response.data).toEqual('Hello World!');
  });
});

afterAll(async () => {
  _server.close();
});
