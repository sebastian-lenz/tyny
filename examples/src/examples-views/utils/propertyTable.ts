export default function propertyTable(
  scope: any,
  properties: string[]
): string {
  return `
    <table class="table table-striped">
      <thead>
        <tr>
          <th width="25%">Property name</th>
          <th width="25%">Type</th>
          <th width="25%">Value</th>
          <th width="25%">Stringified value</th>
        </tr>
      </thead>
      <tbody>
      ${properties
        .map(
          property =>
            `<tr>
              <td width="25%">${property}</td>
              <td width="25%">${typeof scope[property]}</td>
              <td width="25%">${scope[property]}</td>
              <td width="25%">${JSON.stringify(scope[property])}</td>
            </tr>`
        )
        .join('')}
      </tbody>
    </table>`;
}
