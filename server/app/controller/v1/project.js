const Controller = require("egg").Controller;

const ResponseData = require("../../../constant/response");

class ProjectController extends Controller {
  // 项目模版查询
  async index() {
    const { ctx } = this;
    const result = await this.app.mysql.select("template_list");
    ctx.body = result
      ? ResponseData.success(result)
      : ResponseData.fail("模版列表查询失败");
  }

  async show() {
    const { ctx } = this;
    const result = await this.app.mysql.get("template_list", {
      id: ctx.params.id,
    });
    ctx.body = result
      ? ResponseData.success(result)
      : ResponseData.fail("模版列表查询失败");
  }

  // 项目模版新增
  async create() {
    const { ctx } = this;
    const find = await this.app.mysql.get("template_list", {
      id: ctx.request.body.id,
    });
    if (find) {
      ctx.body = ResponseData.fail("模版已存在");
      return;
    }

    const { affectedRows } = await this.app.mysql.insert("template_list", {
      ...ctx.request.body,
    });
    const insertSuccess = affectedRows === 1;
    if (insertSuccess) {
      ctx.body = ResponseData.success({ ...ctx.request.body });
    } else {
      ctx.body = ResponseData.fail("模版新增失败");
    }
  }

  // 项目模版更新
  async update() {
    const { ctx } = this;
    const { affectedRows } = await this.app.mysql.update("template_list", {
      ...ctx.request.body,
    });
    const updateSuccess = affectedRows === 1;
    if (updateSuccess) {
      ctx.body = ResponseData.success({ ...ctx.request.body });
    } else {
      ctx.body = ResponseData.fail("模版更新失败");
    }
  }

  // 项目模版删除
  async destroy() {
    const { ctx } = this;
    const { affectedRows } = await this.app.mysql.delete("template_list", {
      id: ctx.params.id,
    });
    const deleteSuccess = affectedRows === 1;
    if (deleteSuccess) {
      ctx.body = ResponseData.success({ id: ctx.params.id });
    } else {
      ctx.body = ResponseData.fail("模版删除失败");
    }
  }
}

module.exports = ProjectController;
