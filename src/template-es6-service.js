import { ZetaPushGenericService }  from 'zetapush/service/generic'

/**
 * ${ServiceDescription}
 *
 * @class ZetaPush${ServiceName}Service
 * @extends ZetaPushGenericService
 */
export class ZetaPush${ServiceName}Service extends ZetaPushGenericService {
  /**
   * ${VerbImplementatioNotes}
   * @param Function callback
   * @return Object subscription
   */
  on${VerbToPascalCase}(callback) {
    return this.on('${Verb}', callback)
  }

  /**
   * ${VerbImplementatioNotes}
   * @param Object callback
   * @return void
   */
  ${Verb}({ <#list VerbParameterProperties as Property>${Property}<#sep>, </#list> }) {
    this.send('${Verb}', {
      <#list VerbParameterProperties as Property>${Property}<#sep>, </#list>
    })
  }
}
